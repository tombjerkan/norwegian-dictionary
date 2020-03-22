import bs4
from flask import jsonify
import itertools
import re
import requests

from server import app, ApiError
from server.utils import remove_all, take_children_until, TextParser


def is_link(element):
    if not element.has_attr("class"):
        return False

    return "henvisning" in element["class"] or "etymtilvising" in element["class"]


def get_word_linked_to(element):
    on_click_parameter = re.search(
        "^bob_vise_ref_art\\(.*, .*, .*, .*, '(.*)'\\)$", element["onclick"]
    )[1]

    on_click_parameter = re.sub("^[IVX]+\\s+", "", on_click_parameter)
    on_click_parameter = re.sub("\\s+\\([IVX]+\\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\\s+\\(\\d+\\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\\s+\\([IVX]+,\\d+\\)$", "", on_click_parameter)

    return on_click_parameter


text_parser = TextParser(is_link, get_word_linked_to)


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


def parse_entry(container):
    term_column = next(container.children)
    term = re.sub("\\s\\s+", " ", text_parser.parse(term_column))

    article_content = container.find(class_="artikkelinnhold")

    etymology_elements = take_children_until(article_content, ".utvidet")

    senses_container = article_content.find(class_="utvidet")
    sense_containers = senses_container.find_all(class_="tyding", recursive=False)
    is_single_sense = len(sense_containers) <= 1

    if is_single_sense:
        etymology = text_parser.parse(*etymology_elements)
        senses = [parse_sense(senses_container)]
    else:
        pre_senses_text = take_children_until(senses_container, ".tyding")
        etymology = text_parser.parse(*etymology_elements, *pre_senses_text)
        senses = [parse_sense(v) for v in sense_containers]

    return {
        "term": term,
        "etymology": etymology,
        "senses": senses,
    }


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
    return re.sub("^\\d+", "", text_parser.parse(*definition_elements)).strip()


def parse_examples(sense_container):
    example_list = sense_container.find(class_="doemeliste", recursive=False)

    if example_list is None:
        return None

    return text_parser.parse(example_list)


def parse_subdefinitions(sense_container):
    subdefinition_containers = sense_container.select(
        ".tyding.utvidet", recursive=False
    )

    return [parse_subdefinition(v) for v in subdefinition_containers]


def parse_subdefinition(container):
    definition_elements = take_children_until(container, ":scope > .doemeliste")
    examples_container = container.find(class_="doemeliste", recursive=False)

    return {
        "definition": text_parser.parse(*definition_elements),
        "examples": text_parser.parse(examples_container)
        if examples_container
        else None,
    }


def parse_subentries(sense_container):
    subentry_containers = sense_container.select(".artikkelinnhold > div")
    return [parse_subentry(v) for v in subentry_containers]


def parse_subentry(container):
    term_items = take_children_until(container, ".utvidet")
    definition_container = container.find(class_="utvidet", recursive=False)

    return {
        "term": text_parser.parse(*term_items),
        "definition": text_parser.parse(definition_container),
    }
