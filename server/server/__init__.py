from dotenv import load_dotenv
from flask import Flask
import os
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

app = Flask(__name__)
load_dotenv()


if os.environ["FLASK_ENV"] == "production":
    sentry_sdk.init(
        dsn="https://e4c0973426a3496296ee7a2edafb7e24@sentry.io/1764489",
        integrations=[FlaskIntegration()],
    )


class ApiError(Exception):
    def __init__(self, code):
        self.code = code


@app.errorhandler(ApiError)
def handle_api_error(error):
    return "", error.code


from .googletranslate import google_translate
from .wiktionary import wiktionary
from .ordbok import ordbok

__version__ = "0.1.0"
