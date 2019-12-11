import json

from server import app


def test_google_translate():
    app.config["TESTING"] = True

    response = app.test_client().get("/googleTranslate")

    assert json.loads(response.data) == {}
