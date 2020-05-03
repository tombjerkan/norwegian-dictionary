from dotenv import load_dotenv
from flask import Flask, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
import os
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration
from whitenoise import WhiteNoise

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if os.environ["FLASK_ENV"] == "production":
    app.wsgi_app = WhiteNoise(app.wsgi_app, root=os.environ["CLIENT_BUILD_PATH"])

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


@app.route("/", defaults={"path": None})
@app.route("/<path:path>")
def index(path):
    if os.environ["FLASK_ENV"] == "development":
        raise ApiError(400)

    return send_file(
        os.path.join(os.getcwd(), os.environ["CLIENT_BUILD_PATH"], "index.html")
    )


app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
db = SQLAlchemy(app)
migrate = Migrate(app, db)

marshmallow = Marshmallow(app)


from .googletranslate import google_translate
from .wiktionary import wiktionary
from .ordbok import ordbok
from .starred import starred, Starred

__version__ = "0.1.0"
