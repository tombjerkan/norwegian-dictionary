import json

from server import app


def test_wiktionary():
    app.config["TESTING"] = True

    response = app.test_client().get("/wiktionary")

    assert json.loads(response.data) == {}
