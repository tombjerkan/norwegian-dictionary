import bs4
import logging
import re
import requests
import json

from utils import create_response, remove_all, remove_attributes

logger = logging.getLogger()


def lambda_handler(event, context):
    word = event['queryStringParameters']['word']

    try:
        response = requests.get(f"https://ordbokene.no/bm/{word}")
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 503:
            return create_response(503)
        else:
            raise e from None
    except requests.exceptions.ConnectionError as e:
            return create_response(503)

    soup = bs4.BeautifulSoup(response.text, "html.parser")

    content = soup.find(class_="article") or soup.find(class_="suggestion")

    if not content:
        return create_response(404)

    transform_links(soup, content)
    remove_attributes(content, exceptions=["href", "class", "style"])

    report_unexpected_elements(content)
    report_unexpected_classes(content)

    return create_response(200, str(content))


def transform_links(soup, root):
    for link_element in root.find_all("a", class_="article_ref"):
        link_text = link_element.get_text()

        # Some links will have the specific sense in the link text (e.g. "fungere (2)" or
        # "gjære (2II, 1)") but we just want to link to the whole page (e.g. "fungere" or "gjære")
        link_text_without_numeral = re.sub("\\s+\\(\d+[IVX]+(, \d+)?\\)$", "", link_text)

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
