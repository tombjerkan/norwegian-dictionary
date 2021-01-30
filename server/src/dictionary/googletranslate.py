import google
from google.oauth2 import service_account
from google.cloud import translate_v2 as translate
import os

from django.conf import settings
from django.http import HttpResponse, HttpResponseServerError


def google_translate(request, word):
    try:
        credentials = service_account.Credentials.from_service_account_info(
            {
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_email": settings.GOOGLE_AUTH["CLIENT_EMAIL"],
                "private_key": settings.GOOGLE_AUTH["PRIVATE_KEY"],
            }
        )

        client = translate.Client(credentials=credentials)
        response = client.translate(word, source_language="no")
    except (ValueError, google.auth.exceptions.RefreshError) as e:
        return HttpResponseServerError()
    except google.auth.exceptions.TransportError as e:
        return HttpResponse(status=503)

    return HttpResponse(response["translatedText"])
