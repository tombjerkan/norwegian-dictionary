import bs4
from flask import jsonify
import itertools
import re
import requests

from server import app, ApiError

@app.route("/ordbok/<word>")
def ordbok(word):
    try:
        response = requests.get(f"https://ordbok.uib.no/perl/ordbok.cgi?OPP={word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 503:
            raise ApiError(503)
        else:
            raise ApiError(500)
    except requests.exceptions.ConnectionError:
        raise ApiError(503)

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    for hidden_element in soup.find_all(class_="kompakt"):
        hidden_element.decompose()

    for hidden_element in soup.find_all(class_="oppsgramordklassevindu"):
        hidden_element.decompose()

    for style_element in soup.find_all("style"):
        style_element.decompose()

    if len(soup.select("#kolonnebm .ikkefunnet")) != 0:
        raise ApiError(404)

    bokmaal_table = soup.find(id="byttutBM")
    entry_rows = bokmaal_table.find_all("tr", recursive=False)[1:]
    entries = [parse_entry(row) for row in entry_rows]

    return jsonify(entries)


def parse_entry(container):
    article_content = next(container.children).next_sibling.find(class_="artikkelinnhold")
    senses_container = article_content.find(class_="utvidet")
    etymology_elements = reversed(list(senses_container.previous_siblings))

    return {
        "term": re.sub(
            "\s\s+",
            " ",
            get_text_content(next(container.children))
        ),
        "etymology": get_text_content(*etymology_elements),
        "senses": parse_senses(senses_container)
    }


def parse_senses(container):
    is_single_sense = len(container.find_all(class_="tyding", recursive=False)) <= 1
    if is_single_sense:
        return [parse_sense(container)]
    else:
        sense_containers = container.find_all(class_="tyding", recursive=False)
        return [parse_sense(v) for v in sense_containers]


def parse_sense(container):
    return {
        "definition": parse_definition(container),
        "examples": parse_examples(container),
        "subDefinitions": parse_sub_definitions(container),
        "subEntries": parse_sub_entries(container)
    }


def parse_definition(sense_container):
    end_of_definition = sense_container.select_one(".doemeliste, .tyding.utvidet, .artikkelinnhold")

    if end_of_definition is not None:
        definition_elements = reversed(list(end_of_definition.previous_siblings))
    else:
        definition_elements = sense_container.children

    return re.sub("^\d+\s", "", get_text_content(*definition_elements))


def parse_examples(sense_container):
    example_list = sense_container.find(class_="doemeliste", recursive=False)

    if example_list is None:
        return None

    return get_text_content(example_list)


def parse_sub_definitions(sense_container):
    sub_definition_containers = sense_container.select(".tyding.utvidet", recursive=False)

    return [parse_sub_definition(v) for v in sub_definition_containers]


def parse_sub_definition(container):
    examples_container = container.find(class_="doemeliste", recursive=False)

    if examples_container:
        definition_elements = reversed(list(examples_container.previous_siblings))
    else:
        definition_elements = container.children

    return {
        "definition": get_text_content(*definition_elements),
        "examples": get_text_content(examples_container) if examples_container else None
    }


def parse_sub_entries(sense_container):
    sub_entry_containers = sense_container.select(".artikkelinnhold > div", recursive=False)
    return [parse_sub_entry(v) for v in sub_entry_containers]


def parse_sub_entry(container):
    term_container = container.find(class_="artikkeloppslagsord", recursive=False)
    definition_container = container.find(class_="utvidet", recursive=False)

    return {
        "term": get_text_content(term_container),
        "definition": get_text_content(definition_container)
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
        "^bob_vise_ref_art\(.*, .*, .*, .*, '(.*)'\)$",
        element["onclick"]
    )[1]

    on_click_parameter = re.sub("^[IVX]+\s+", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\([IVX]+\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\(\d+\)$", "", on_click_parameter)
    on_click_parameter = re.sub("\s+\([IVX]+,\d+\)$", "", on_click_parameter)

    return on_click_parameter
