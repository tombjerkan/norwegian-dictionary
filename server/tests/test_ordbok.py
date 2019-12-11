import json

from server import app


def test_ordbok():
    app.config["TESTING"] = True

    response = app.test_client().get("/ordbok")

    assert json.loads(response.data) == {}
