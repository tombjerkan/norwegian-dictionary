import google
from google.oauth2 import service_account
from google.cloud import translate_v2 as translate
import os

from server import app, ApiError


@app.route("/api/googleTranslate/<word>")
def google_translate(word):
    try:
        credentials = service_account.Credentials.from_service_account_info(
            {
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_email": os.getenv("GOOGLE_AUTH_CLIENT_EMAIL"),
                "private_key": os.getenv("GOOGLE_AUTH_PRIVATE_KEY"),
            }
        )

        client = translate.Client(credentials=credentials)
        response = client.translate(word, source_language="no")
    except (ValueError, google.auth.exceptions.RefreshError) as e:
        raise ApiError(500) from e
    except google.auth.exceptions.TransportError as e:
        raise ApiError(503) from e

    return response["translatedText"]
