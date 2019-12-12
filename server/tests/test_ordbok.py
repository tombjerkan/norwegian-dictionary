import json
import os
import pytest
import requests
import responses

from server import app


def read_data_file(filename):
    current_file_directory = os.path.dirname(__file__)
    data_file_path = os.path.join(current_file_directory, "__data__", "ordbok", filename)
    with open(data_file_path, mode="r") as file:
        return file.read()


#  Words are added as test cases when an error is caused parsing their pages.
#  The list below outlines what about their page was different to all previous
#  test cases that meant that the cause of the error was not caught by an
#  existing test case.
#
#      stas, for:          initial test pages
#
#      tilsynelatende:     only one sense
#
#      male:               sub-definition without examples and link with
#                          number instead of roman numeral (svive (1))
#
#      ting:               multiple sub-definitions for a single sense and
#                          link with number and roman numeral (yrke (II,1))
#
#      skjermen:           results for another form of the word shown instead,
#                          in this case 'skjerm'.
#
@pytest.mark.parametrize("word", ["stas", "for", "tilsynelatende", "male", "ting", "skjermen"])
@responses.activate
def test_correctly_parses_html_into_data_structure(word):
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://ordbok.uib.no/perl/ordbok.cgi?OPP={word}",
        status=200,
        body=read_data_file(f"{word}.html"),
        content_type="text/html; charset=UTF-8"
    )

    response = app.test_client().get(f"/ordbok/{word}")

    expected_data = json.loads(read_data_file(f"{word}.json"))
    received_data = json.loads(response.data)
    assert expected_data == received_data
    assert response.status_code == 200


@responses.activate
def test_returns_not_found_404_if_not_found_page_is_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://ordbok.uib.no/perl/ordbok.cgi?OPP=notaword",
        status=200,
        body=read_data_file("not-found.html"),
        content_type="text/html; charset=UTF-8"
    )

    response = app.test_client().get(f"/ordbok/notaword")

    assert response.status_code == 404


@responses.activate
def test_returns_service_unavailable_503_if_network_error():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://ordbok.uib.no/perl/ordbok.cgi?OPP=hallo",
        body=requests.exceptions.ConnectionError()
    )

    response = app.test_client().get("/ordbok/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_service_unavailable_503_if_service_unavailable_is_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://ordbok.uib.no/perl/ordbok.cgi?OPP=hallo",
        status=503
    )

    response = app.test_client().get(f"/ordbok/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_internal_server_error_500_if_other_http_error_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://ordbok.uib.no/perl/ordbok.cgi?OPP=hallo",
        status=404
    )

    response = app.test_client().get(f"/ordbok/hallo")

    assert response.status_code == 500
