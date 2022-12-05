import google
from google.oauth2 import service_account
from google.cloud import translate_v2 as translate
import base64
import os

from utils import create_response


def lambda_handler(event, context):
    word = event['queryStringParameters']['word']

    google_client_email = os.getenv('GOOGLE_AUTH_CLIENT_EMAIL')
    encoded_google_private_key = os.getenv('GOOGLE_AUTH_PRIVATE_KEY')

    if not google_client_email:
        raise Error('Environment variable GOOGLE_AUTH_CLIENT_EMAIL is not configured.')

    if not encoded_google_private_key:
        raise Error('Environment variable GOOGLE_AUTH_PRIVATE_KEY is not configured.')

    google_private_key = base64.b64decode(encoded_google_private_key)

    try:
        credentials = service_account.Credentials.from_service_account_info(
            {
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_email": google_client_email,
                "private_key": google_private_key,
            }
        )

        client = translate.Client(credentials=credentials)
        response = client.translate(word, source_language="no")
    except (ValueError, google.auth.exceptions.RefreshError) as e:
        raise e from None
    except google.auth.exceptions.TransportError as e:
        return create_response(503)

    return create_response(200, response['translatedText'])
