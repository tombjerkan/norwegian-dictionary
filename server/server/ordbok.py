import bs4
import re
import requests

from server import app, ApiError
from server.utils import remove_all, remove_attributes


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
    bokmaal_table = soup.find(id="byttutBM")
    if not bokmaal_table:
        raise ApiError(404)

    remove_all(bokmaal_table, ".kompakt")
    remove_all(bokmaal_table, ".oppsgramordklassevindu")
    remove_all(bokmaal_table, "style")
    transform_links(soup, bokmaal_table)
    replace_circle_image(soup, bokmaal_table)
    remove_attributes(bokmaal_table, exceptions=["href", "class", "style"])

    entry_rows = bokmaal_table.find_all("tr", recursive=False)[1:]

    result = bs4.BeautifulSoup("<entries />", "html.parser")
    for entry in entry_rows:
        term_column = entry.contents[0]
        term_column.br.replace_with(" ")
        term_element = result.new_tag("term")
        term_element.append(term_column.get_text())

        article_content = entry.find(class_="artikkelinnhold")
        content_element = result.new_tag("content")
        article_content.wrap(content_element)
        article_content.unwrap()

        entry_element = result.new_tag("entry")
        entry_element.append(term_element)
        entry_element.append(content_element)

        result.entries.append(entry_element)

    report_unexpected_classes(result)

    return result.prettify()


def transform_links(soup, root):
    for link_element in root.select(".henvisning, .etymtilvising"):
        on_click_parameter = re.search(
            "^bob_vise_ref_art\\(.*, .*, .*, .*, '(.*)'\\)$", link_element["onclick"],
        )[1]

        on_click_parameter = re.sub("^[IVX]+\\s+", "", on_click_parameter)
        on_click_parameter = re.sub("\\s+\\([IVX]+\\)$", "", on_click_parameter)
        on_click_parameter = re.sub("\\s+\\(\\d+\\)$", "", on_click_parameter)
        on_click_parameter = re.sub("\\s+\\([IVX]+,\\d+\\)$", "", on_click_parameter)

        anchor = soup.new_tag("a", href=on_click_parameter)
        link_element.wrap(anchor)
        link_element.unwrap()


# An image is used for bullet points in lists, which must be replaced with
# something that can be used by client:
#
#   <img src="/grafikk/black_circle_e.png" width="6px" height="6px"/>
#
def replace_circle_image(soup, root):
    for image in root.find_all("img"):
        if image["src"] == "/grafikk/black_circle_e.png":
            bullet = soup.new_tag("bullet")
            image.replace_with(bullet)


def remove_unwanted_attributes(root):
    for element in root.find_all():
        attributes = element.attrs.keys()
        attributes_to_delete = [
            v for v in attributes if v != "href" and v != "class" and v != "style"
        ]
        for attribute in attributes_to_delete:
            del element[attribute]


def report_unexpected_classes(root):
    all_classes = {
        _class for element in root.find_all() for _class in element.get("class", [])
    }
    expected_classes = set({})
    unexpected_classes = all_classes - expected_classes

    print("Unexpected classes:")
    for _class in unexpected_classes:
        print(f"- {_class}")
