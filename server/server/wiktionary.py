import bs4
from flask import jsonify
import itertools
import re
import requests

from server import app, ApiError


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
    "Verb"
]

@app.route("/wiktionary/<word>")
def wiktionary(word):
    try:
        response = requests.get(f"https://en.wiktionary.org/wiki/{word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise ApiError(404)
        elif e.response.status_code == 503:
            raise ApiError(503)
        else:
            raise ApiError(500)
    except requests.exceptions.ConnectionError:
        raise ApiError(503)

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    for edit_button in soup.find_all(class_="mw-editsection"):
        edit_button.decompose()

    # Navigable strings with only '\n' are purely syntactic
    # Removal makes parsing easier
    for syntactic_new_line in soup.find_all(string="\n"):
        syntactic_new_line.extract()

    norwegian_section = get_norwegian_section(soup)

    entries = separate_entries(norwegian_section)
    return jsonify([parse_entry(entry) for entry in entries])


def index_by_predicate(it, predicate, start=0):
    for i, v in enumerate(itertools.islice(it, start, None), start):
        if (predicate(v)):
            return i


def is_language_header(element):
    return element.name == "h2"


def get_norwegian_section(soup):
    container = soup.find(class_="mw-parser-output")

    norwegian_header_index = index_by_predicate(
        container.children,
        lambda child: is_language_header(child) and child.get_text() == "Norwegian Bokmål"
    )

    if norwegian_header_index is None:
        raise ApiError(404)

    end_index = index_by_predicate(
        container.children,
        is_language_header,
        norwegian_header_index + 1
    )

    return list(itertools.islice(container.children, norwegian_header_index + 1, end_index))


def separate_entries(language_entry):
    if has_multiple_entries(language_entry):
        header_indices = [i for i, v in enumerate(language_entry) if is_entry_header(v)]
        start_indices = [i + 1 for i in header_indices]
        end_indices = header_indices[1:] + [len(language_entry)]

        return [language_entry[start:end] for start, end in zip(start_indices, end_indices)]
    else:
        return [language_entry]


def is_header(element):
    return element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]


def has_multiple_entries(language_entry):
    return any(is_entry_header(element) for element in language_entry)


def is_entry_header(element):
    return is_header(element) and re.match("^Etymology \d+$", element.get_text())


def parse_entry(elements):
    return {
        "etymology": parse_etymology(elements),
        "subEntries": parse_sub_entries(elements),
        "synonyms": parse_synonyms(elements),
        "derived": parse_derived_terms(elements)
    }


def get_section(elements, header):
    header_index = index_by_predicate(
        elements,
        lambda element: is_header(element) and element.get_text() == header
    )

    if header_index is None:
        return None

    next_header_index = index_by_predicate(elements, is_header, header_index + 1)

    if next_header_index is not None:
        return elements[header_index + 1:next_header_index]
    else:
        return elements[header_index + 1:]


def parse_etymology(elements):
    etymology_section = get_section(elements, "Etymology")
    if etymology_section is None:
        first_header_index = index_by_predicate(elements, is_header)
        etymology_section = elements[:first_header_index]

    if len(etymology_section) == 0:
        return None

    return get_text_content(*etymology_section)


def parse_sub_entries(elements):
    types = [e.get_text() for e in elements if is_part_of_speech_header(e)]
    sub_entry_sections = [get_section(elements, t) for t in types]

    return [
        {
            "type": type_,
            "term": get_text_content(section[0]),
            "senses": [parse_sense(sense) for sense in section[1].children]
        }
        for type_, section in zip(types, sub_entry_sections)
    ]


def is_part_of_speech_header(element):
    return is_header(element) and element.get_text() in PART_OF_SPEECH_TYPES


def parse_sense(sense):
    definition_nodes = itertools.takewhile(
        lambda element: not element.name == "dl",
        sense.children
    )
    definition = get_text_content(*definition_nodes)

    examples = [get_text_content(example) for example in sense.select("dl > dd")]

    return {
        "definition": definition,
        "examples": examples
    }


def parse_synonyms(elements):
    section = get_section(elements, "Synonyms")

    if section is None:
        return []

    return [get_text_content(element) for element in section[0].children]


def parse_derived_terms(elements):
    section = get_section(elements, "Derived terms")

    if section is None:
        return []

    return [
        get_text_content(item)
        for element in section for item in element.find_all("li")
    ]


def get_text_content(*args):
    return "".join(__get_text_content(arg) for arg in args).strip()


def __get_text_content(element):
    if isinstance(element, bs4.element.Tag):
        if is_link(element):
            text_content = get_text_content(*element.children)
            to = get_word_linked_to(element)
            return f"<Link to='{to}'>{text_content}</Link>"
        else:
            return get_text_content(*element.children)
    elif isinstance(element, bs4.element.NavigableString):
        return element.string
    else:
        return ""


def is_link(element):
    return element.name == "a" and get_word_linked_to(element) is not None


def get_word_linked_to(anchor):
    match = re.search("\/wiki\/(.+)#Norwegian_Bokmål", anchor["href"])

    if match:
        return match[1]
    else:
        return None
