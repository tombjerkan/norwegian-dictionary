import bs4
import itertools
import logging
import re
import requests

from utils import create_response, remove_all, remove_attributes

logger = logging.getLogger()


def lambda_handler(event, context):
    word = event['queryStringParameters']['word']

    try:
        response = requests.get(f"https://en.wiktionary.org/wiki/{word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            return create_response(404)
        elif e.response.status_code == 503:
            return create_response(503)
        else:
            raise e from None
    except requests.exceptions.ConnectionError as e:
        return create_response(503)

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    remove_all(soup, ".mw-editsection")
    remove_all(soup, ".sister-wikipedia")
    remove_comments(soup)

    norwegian_section = get_norwegian_section(soup)

    if not norwegian_section:
            return create_response(404)

    remove_unwanted_sections(norwegian_section.div)
    transform_links(norwegian_section.div)
    remove_attributes(norwegian_section, exceptions=["class", "style", "href"])

    report_unexpected_classes(norwegian_section)
    report_unexpected_elements(norwegian_section)

    return create_response(200, str(norwegian_section))


def unwrap_all(root, selector):
    for element in root.select(selector):
        element.unwrap()


def transform_links(root):
    for anchor in root.select("a"):
        match = re.search("\\/wiki\\/(.+)#Norwegian_Bokmål", anchor["href"])

        if match:
            anchor["href"] = match[1]
        else:
            anchor.unwrap()


def get_norwegian_section(soup):
    container = soup.find(class_="mw-parser-output")

    language_headers = container.find_all(class_="mw-heading2")
    norwegian_bokmal_headers = [
        v for v in language_headers if v.get_text() == "Norwegian Bokmål"
    ]

    if len(norwegian_bokmal_headers) == 0:
        return None

    norwegian_header = norwegian_bokmal_headers[0]
    norwegian_section = itertools.takewhile(
        lambda v: v not in language_headers,
        norwegian_header.next_siblings
    )

    soup = bs4.BeautifulSoup("<div />", "html.parser")
    soup.div.extend(list(norwegian_section))

    return soup


def is_header(element):
    return element.name in ["h1", "h2", "h3", "h4", "h5", "h6"]


def remove_comments(soup):
    for comment in soup.find_all(string=lambda v: isinstance(v, bs4.Comment)):
        comment.extract()


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
        if isinstance(element, bs4.Tag):
            element.decompose()
        else:
            element.extract()


def report_unexpected_elements(soup):
    all_elements = {element.name for element in soup.find_all()}

    expected_elements = {
        "div",
        "span",
        "abbr",
        "b",
        "strong",
        "i",
        "dl",
        "dd",
        "a",
        "h3",
        "h4",
        "h5",
        "p",
        "ol",
        "ul",
        "li",
    }

    unexpected_elements = all_elements - expected_elements

    if unexpected_elements:
        logger.warn("Unexpected elements in source HTML: " + ", ".join(unexpected_elements))


def report_unexpected_classes(soup):
    all_classes = {
        _class for element in soup.find_all() for _class in element.get("class", [])
    }
    expected_classes = {
        "e-translation",
        "selflink",
        "form-of-definition",
        "use-with-mention",
        "gender",
        "Latn",
        "etyl",
        "headword",
        "h-usage-example",
        "e-example",
        "mention",
        "form-of-definition-link",
        "mw-headline",
    }
    unexpected_classes = all_classes - expected_classes

    if unexpected_classes:
        logger.warn("Unexpected classes in source HTML: " + ", ".join(unexpected_classes))
