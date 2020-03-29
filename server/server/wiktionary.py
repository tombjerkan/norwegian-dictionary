import bs4
from flask import jsonify
import itertools
import re
import requests

from server import app, ApiError
from server.utils import remove_all, create_text_parser


PART_OF_SPEECH_TYPES = [
    "Adjective",
    "Adverb",
    "Ambiposition",
    "Article",
    "Circumposition",
    "Classifier",
    "Conjunction",
    "Contraction",
    "Counter",
    "Determiner",
    "Ideophone",
    "Interjection",
    "Noun",
    "Numeral",
    "Participle",
    "Particle",
    "Postposition",
    "Preposition",
    "Pronoun",
    "Proper noun",
    "Verb",
]


def is_link(element):
    return element.name == "a" and get_word_linked_to(element) is not None


def get_word_linked_to(anchor):
    match = re.search("\\/wiki\\/(.+)#Norwegian_Bokmål", anchor["href"])

    if match:
        return match[1]
    else:
        return None


parse = create_text_parser(is_link, get_word_linked_to)


@app.route("/api/wiktionary/<word>")
def wiktionary(word):
    try:
        response = requests.get(f"https://en.wiktionary.org/wiki/{word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise ApiError(404)
        elif e.response.status_code == 503:
            raise ApiError(503) from e
        else:
            raise ApiError(500) from e
    except requests.exceptions.ConnectionError as e:
        raise ApiError(503) from e

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    remove_all(soup, ".mw-editsection")

    # Navigable strings with only '\n' are purely syntactic
    # Removal makes parsing easier
    for syntactic_new_line in soup.find_all(string="\n"):
        syntactic_new_line.extract()

    norwegian_section = get_norwegian_section(soup)

    remove_unwanted_sections(norwegian_section.div)
    unwrap_all(norwegian_section.div, "span")
    unwrap_all(norwegian_section.div, "div")
    transform_links(norwegian_section.div)
    remove_unwanted_attributes(norwegian_section.div)

    return norwegian_section.prettify()


def unwrap_all(root, selector):
    elements = root.select(selector)
    for element in elements:
        element.unwrap()


def transform_links(root):
    anchors = root.select("a")
    for anchor in anchors:
        word_linked_to = get_word_linked_to(anchor)
        if word_linked_to is not None:
            anchor["href"] = word_linked_to
        else:
            anchor.unwrap()


def remove_unwanted_attributes(root):
    for element in root.find_all():
        attributes = element.attrs.keys()
        attributes_to_delete = [v for v in attributes if v != "href"]
        for attribute in attributes_to_delete:
            del element[attribute]


def index_by_predicate(it, predicate, start=0):
    for i, v in enumerate(itertools.islice(it, start, None), start):
        if predicate(v):
            return i


def is_language_header(element):
    return element.name == "h2"


def get_norwegian_section(soup):
    container = soup.find(class_="mw-parser-output")

    norwegian_header_index = index_by_predicate(
        container.children,
        lambda child: is_language_header(child)
        and child.get_text() == "Norwegian Bokmål",
    )

    if norwegian_header_index is None:
        raise ApiError(404)

    end_index = index_by_predicate(
        container.children, is_language_header, norwegian_header_index + 1
    )

    norwegian_elements = container.contents[norwegian_header_index + 1 : end_index]

    soup = bs4.BeautifulSoup("<div />", "html.parser")

    for element in norwegian_elements:
        soup.div.append(element)

    return soup


def is_header(element):
    return element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]


def remove_unwanted_sections(elements):
    is_current_section_wanted = True
    unwanted_sections = ["Pronunciation", "References"]

    # Keep list of elements to remove rather than removing within loop, as
    # list cannot be mutated while looping over it.
    elements_to_remove = []

    for element in list(elements.children):
        if is_header(element):
            if element.get_text() in unwanted_sections:
                is_current_section_wanted = False
            else:
                is_current_section_wanted = True

        if not is_current_section_wanted:
            elements_to_remove.append(element)

    for element in elements_to_remove:
        element.decompose()
