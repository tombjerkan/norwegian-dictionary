import json
import os
import pytest
import requests
import responses

from server import app


def read_data_file(filename):
    current_file_directory = os.path.dirname(__file__)
    data_file_path = os.path.join(
        current_file_directory, "__data__", "wiktionary", filename
    )
    with open(data_file_path, mode="r") as file:
        return file.read()


@responses.activate
def test_correctly_returns_norwegian_bokmal_part_of_html():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        f"https://en.wiktionary.org/wiki/for",
        status=200,
        body=read_data_file(f"for-original.html"),
        content_type="text/html; charset=UTF-8",
    )

    response = app.test_client().get(f"/api/wiktionary/for")

    expected_data = read_data_file(f"for-parsed.html")
    assert expected_data == response.data.decode("utf-8")
    assert response.status_code == 200


@responses.activate
def test_returns_not_found_404_if_not_found_page_is_received():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/notaword",
        status=404,
        body=read_data_file("not-found.html"),
        content_type="text/html; charset=UTF-8",
    )

    response = app.test_client().get("/api/wiktionary/notaword")

    assert response.status_code == 404


@responses.activate
def test_returns_not_found_404_if_no_norwegian_bokmaal_entry_on_received_page():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/rain",
        status=200,
        body=read_data_file("not-norwegian.html"),
        content_type="text/html; charset=UTF-8",
    )

    response = app.test_client().get("/api/wiktionary/rain")

    assert response.status_code == 404


@responses.activate
def test_returns_service_unavailable_503_if_network_error():
    app.config["TESTING"] = True
    responses.add(
        responses.GET,
        "https://en.wiktionary.org/wiki/hallo",
        body=requests.exceptions.ConnectionError(),
    )

    response = app.test_client().get("/api/wiktionary/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_service_unavailable_503_if_service_unavailable_received():
    app.config["TESTING"] = True
    responses.add(responses.GET, "https://en.wiktionary.org/wiki/hallo", status=503)

    response = app.test_client().get("/api/wiktionary/hallo")

    assert response.status_code == 503


@responses.activate
def test_returns_internal_server_error_if_other_http_error_received():
    app.config["TESTING"] = True
    responses.add(responses.GET, "https://en.wiktionary.org/wiki/hallo", status=500)

    response = app.test_client().get("/api/wiktionary/hallo")

    assert response.status_code == 500
