import bs4
import itertools
import re
import requests

from server import app, ApiError
from server.utils import remove_all, remove_attributes


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
    transform_links(norwegian_section.div)
    remove_attributes(norwegian_section, exceptions=["class", "style", "href"])

    report_unexpected_classes(norwegian_section)

    return str(norwegian_section)


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

    language_headers = container.find_all("h2")
    norwegian_bokmal_headers = [
        v for v in language_headers if v.get_text() == "Norwegian Bokmål"
    ]

    if len(norwegian_bokmal_headers) == 0:
        raise ApiError(404)

    norwegian_header = norwegian_bokmal_headers[0]
    norwegian_section = itertools.takewhile(
        lambda v: v.name != "h2", norwegian_header.next_siblings
    )

    soup = bs4.BeautifulSoup("<div />", "html.parser")
    soup.div.extend(list(norwegian_section))

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

    print("Unexpected classes:")
    for _class in unexpected_classes:
        print(f"- {_class}")
