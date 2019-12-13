from dotenv import load_dotenv
from flask import Flask

app = Flask(__name__)
load_dotenv()


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
