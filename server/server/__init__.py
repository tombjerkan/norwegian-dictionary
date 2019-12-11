from flask import Flask
app = Flask(__name__)

from .googletranslate import google_translate
from .wiktionary import wiktionary
from .ordbok import ordbok

__version__ = '0.1.0'
