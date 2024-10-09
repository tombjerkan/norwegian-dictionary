import bs4
import logging
import re
import requests
import json

from utils import create_response, remove_all, remove_attributes

logger = logging.getLogger()


def lambda_handler(event, context):
    word = event['queryStringParameters']['word']

    definitions_response = try_get_definitions(word)
    soup = bs4.BeautifulSoup(definitions_response, "html.parser")
    content = soup.find(class_="article")

    if content is not None:
        transform_links(soup, content)
        remove_attributes(content, exceptions=["href", "class", "style"])

        report_unexpected_elements(content)
        report_unexpected_classes(content)

    suggestions_response = try_get_suggestions(word)
    suggestions = json.loads(suggestions_response)
    inflections = [inflection for [inflection, _] in suggestions["a"].get("inflect", [])]

    response_status = 200 if content or inflections else 404

    response_body = {
        "content": str(content) if content else None,
        "inflections": inflections
    }

    return create_response(response_status, json.dumps(response_body))


def try_get_definitions(word):
    try:
        response = requests.get(f"https://ordbokene.no/bm/{word}")
        response.raise_for_status()
        return response.text
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 503:
            return create_response(503)
        else:
            raise e from None
    except requests.exceptions.ConnectionError as e:
            return create_response(503)


def try_get_suggestions(word):
    try:
        response = requests.get(f"https://oda.uib.no/opal/prod/api/suggest?&q={word}&dict=bm&n=8&dform=int&meta=n&include=eifst")
        response.raise_for_status()
        return response.text
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 503:
            return create_response(503)
        else:
            raise e from None
    except requests.exceptions.ConnectionError as e:
            return create_response(503)


def transform_links(soup, root):
    for link_element in root.find_all("a", class_="article_ref"):
        link_text = link_element.get_text()

        # Some links will have the specific sense in the link text (e.g. "fungere (2)" or
        # "gjære (2II, 1)") but we just want to link to the whole page (e.g. "fungere" or "gjære")
        link_text_without_numeral = re.sub("\\s+\\(\d+[IVX]*(, \d+)?\\)$", "", link_text)

        link_element['href'] = link_text_without_numeral


def remove_unwanted_attributes(root):
    for element in root.find_all():
        attributes = element.attrs.keys()
        attributes_to_delete = [
            v for v in attributes if v != "href" and v != "class" and v != "style"
        ]
        for attribute in attributes_to_delete:
            del element[attribute]


def report_unexpected_elements(content):
    soup = bs4.BeautifulSoup(f"<div>{content}</div>", "html.parser")

    all_elements = {element.name for element in soup.find_all()}

    expected_elements = {
        "div",
        "span",
        "a",
        "bullet",
    }

    unexpected_elements = all_elements - expected_elements

    if unexpected_elements:
        logger.warn("Unexpected elements in source HTML: " + ", ".join(unexpected_elements))


def report_unexpected_classes(content):
    soup = bs4.BeautifulSoup(f"<div>{content}</div>", "html.parser")

    all_classes = {
        _class for element in soup.find_all() for _class in element.get("class", [])
    }
    expected_classes = {"utvidet", "tyding", "doeme", "doemeliste"}
    unexpected_classes = all_classes - expected_classes

    if unexpected_classes:
        logger.warn("Unexpected classes in source HTML: " + ", ".join(unexpected_classes))
