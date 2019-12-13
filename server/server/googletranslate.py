import google.oauth2
from google.cloud import translate_v2 as translate
import os

from server import app, ApiError


@app.route("/googleTranslate/<word>")
def google_translate(word):
    service_account_info = {
        "token_uri": "https://oauth2.googleapis.com/token",
        "client_email": os.getenv("GOOGLE_AUTH_CLIENT_EMAIL"),
        "private_key": os.getenv("GOOGLE_AUTH_PRIVATE_KEY")
    }

    try:
        credentials = google.oauth2.service_account.Credentials.from_service_account_info(service_account_info)
    except ValueError:
        raise ApiError(500)

    client = translate.Client(credentials=credentials)

    try:
        response = client.translate(word, source_language="no")
    except google.auth.exceptions.RefreshError:
        raise ApiError(500)

    return response["translatedText"]
