import json
import os
import pytest
import requests
import responses

from server import app


def read_data_file(filename):
    current_file_directory = os.path.dirname(__file__)
    data_file_path = os.path.join(current_file_directory, "__data__", "wiktionary", filename)
    with open(data_file_path, mode="r") as file:
        return file.read()


#  Words are added as test cases when an error is caused parsing their pages.
#  The list below outlines what about their page was different to all previous
#  test cases that meant that the cause of the error was not caught by an
#  existing test case.
#
#      for:                initial test page
#
#      tilsynelatende:     only one entry
#
#      stor:               derived terms in hideable table
#
#      lys:                'Pronunciation' section within single 'Etymology'
#                          section, multiple types in a single entry, larger
#                          list format for 'Derived terms'
#
@pytest.mark.parametrize("word", ["for", "tilsynelatende", "stor", "lys"])
@responses.activate
def test_correctly_parses_html_into_data_structure(word):
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://en.wiktionary.org/wiki/{word}",
        status=200,
        body=read_data_file(f"{word}.html")
    )

    response = app.test_client().get(f"/wiktionary/{word}")

    expected_data = json.loads(read_data_file(f"{word}.json"))
    received_data = json.loads(response.data)
    assert expected_data == received_data
    assert response.status_code == 200


@responses.activate
def test_returns_not_found_404_if_not_found_page_is_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/notaword",
        status=404,
        body=read_data_file("not-found.html")
    )

    response = app.test_client().get("/wiktionary/notaword")

    assert response.status_code == 404


@responses.activate
def test_returns_not_found_404_if_no_norwegian_bokmaal_entry_on_received_page():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/rain",
        status=200,
        body=read_data_file("not-norwegian.html")
    )

    response = app.test_client().get("/wiktionary/rain")

    assert response.status_code == 404


@responses.activate
def test_returns_service_unavailable_503_if_network_error():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/hallo",
        body=requests.exceptions.ConnectionError()
    )

    response = app.test_client().get("/wiktionary/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_service_unavailable_503_if_service_unavailable_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/hallo",
        status=503
    )

    response = app.test_client().get("/wiktionary/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_internal_server_error_if_other_http_error_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/hallo",
        status=500
    )

    response = app.test_client().get("/wiktionary/hallo")

    assert response.status_code == 500
