import bs4
from flask import jsonify
import itertools
import re
import requests

from server import app, ApiError


@app.route("/api/ordbok/<word>")
def ordbok(word):
    try:
        response = requests.get(f"https://ordbok.uib.no/perl/ordbok.cgi?OPP={word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 503:
            raise ApiError(503) from e
        else:
            raise ApiError(500) from e
    except requests.exceptions.ConnectionError as e:
        raise ApiError(503) from e

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    remove_all(soup, ".kompakt")
    remove_all(soup, ".oppsgramordklassevindu")
    remove_all(soup, "style")

    bokmaal_table = soup.find(id="byttutBM")
    if not bokmaal_table:
        raise ApiError(404)

    entry_rows = bokmaal_table.find_all("tr", recursive=False)[1:]
    entries = [parse_entry(v) for v in entry_rows]

    return jsonify(entries)


def remove_all(root, selector):
    for element in root.select(selector):
        element.decompose()


def take_children_until(root, selector):
    match = root.select_one(selector)
    return itertools.takewhile(lambda e: e != match, root.children)


def parse_entry(container):
    term_column = next(container.children)
    article_content = container.find(class_="artikkelinnhold")
    etymology_elements = take_children_until(article_content, ".utvidet")
    senses_container = article_content.find(class_="utvidet")

    return {
        "term": re.sub("\s\s+", " ", get_text_content(term_column)),
        "etymology": get_text_content(*etymology_elements),
        "senses": parse_senses(senses_container),
    }


def parse_senses(container):
    sense_containers = container.find_all(class_="tyding", recursive=False)
    is_single_sense = len(sense_containers) <= 1

    if is_single_sense:
        return [parse_sense(container)]
    else:
        return [parse_sense(v) for v in sense_containers]


def parse_sense(container):
    return {
        "definition": parse_definition(container),
        "examples": parse_examples(container),
        "subDefinitions": parse_subdefinitions(container),
        "subEntries": parse_subentries(container),
    }


def parse_definition(sense_container):
    definition_elements = take_children_until(
        sense_container, ".doemeliste, .tyding.utvidet, .artikkelinnhold"
    )
    return re.sub("^\d+\s", "", get_text_content(*definition_elements))


def parse_examples(sense_container):
    example_list = sense_container.find(class_="doemeliste", recursive=False)

    if example_list is None:
        return None

    return get_text_content(example_list)


def parse_subdefinitions(sense_container):
    subdefinition_containers = sense_container.select(
        ".tyding.utvidet", recursive=False
    )

    return [parse_subdefinition(v) for v in subdefinition_containers]


def parse_subdefinition(container):
    definition_elements = take_children_until(container, ":scope > .doemeliste")
    examples_container = container.find(class_="doemeliste", recursive=False)

    return {
        "definition": get_text_content(*definition_elements),
        "examples": get_text_content(examples_container)
        if examples_container
        else None,
    }


def parse_subentries(sense_container):
    subentry_containers = sense_container.select(".artikkelinnhold > div")
    return [parse_subentry(v) for v in subentry_containers]


def parse_subentry(container):
    term_container = container.find(class_="artikkeloppslagsord", recursive=False)
    definition_container = container.find(class_="utvidet", recursive=False)

    return {
        "term": get_text_content(term_container),
        "definition": get_text_content(definition_container),
    }


def get_text_content(*args):
    return __get_text_content_nodes(*args).strip()


def __get_text_content_nodes(*args):
    return "".join(__get_text_content_node(arg) for arg in args)


def __get_text_content_node(element):
    if isinstance(element, bs4.element.Tag):
        if is_link(element):
            text_content = __get_text_content_nodes(*element.children)
            to = get_word_linked_to(element)
            return f"<Link to='{to}'>{text_content}</Link>"
        else:
            return __get_text_content_nodes(*element.children)
    elif isinstance(element, bs4.element.NavigableString):
        return re.sub("\s+", " ", element.string)
    else:
        return ""


def is_link(element):
    if not element.has_attr("class"):
        return False

    return "henvisning" in element["class"] or "etymtilvising" in element["class"]


def get_word_linked_to(element):
    on_click_parameter = re.search(
        "^bob_vise_ref_art\(.*, .*, .*, .*, '(.*)'\)$", element["onclick"]
    )[1]

    on_click_parameter = re.sub("^[IVX]+\s+", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\([IVX]+\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\(\d+\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\([IVX]+,\d+\)$", "", on_click_parameter)

    return on_click_parameter
