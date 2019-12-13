import google.auth
import json
import os
import unittest.mock

from server import app


@unittest.mock.patch("google.cloud.translate_v2.Client.translate", unittest.mock.Mock(side_effect=google.auth.exceptions.RefreshError()))
def test_returns_internal_server_error_500_if_no_client_email_env_variable():
    os.environ["GOOGLE_AUTH_PRIVATE_KEY"] = "<private_key>"
    app.config["TESTING"] = True

    response = app.test_client().get("/googleTranslate/hallo")

    assert response.status_code == 500


@unittest.mock.patch("google.oauth2.service_account.Credentials.from_service_account_info", unittest.mock.Mock(side_effect=ValueError()))
def test_returns_internal_server_error_500_if_no_private_key_env_variable():
    os.environ["GOOGLE_AUTH_CLIENT_EMAIL"] = "<client_email>"
    app.config["TESTING"] = True

    response = app.test_client().get("/googleTranslate/hallo")

    assert response.status_code == 500


@unittest.mock.patch("google.cloud.translate_v2.Client.translate", unittest.mock.Mock(side_effect=google.auth.exceptions.RefreshError()))
def test_returns_internal_server_error_500_if_incorrect_credentials():
    os.environ["GOOGLE_AUTH_CLIENT_EMAIL"] = "<client_email>"
    os.environ["GOOGLE_AUTH_PRIVATE_KEY"] = "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQC/Anrid6sGUoQc\nhmjmlqUPXuiFLfRjND6YG4CblbQCXgBbyZul6fxch2hBtjBBqKtHraRfwd7bANcn\nFRUupo6cFXxj9cnn+LSvoEQPWc9o28THYM3yv/YHDQiPIS7M2WQBt1xigkvZKygh\n2t0XSipF5lU3oQwIQv/896TPzKVMb1rbQK8XU8QGQ/QO5kJ889TdDn32kd3mgX4W\nXqxgWwNxg2e3SGAs66r+RXv1yTTZ4vn+aQehOxmlIqrQ5pab4cZWz3Nji6z1wQ4k\nPhqm5sO0LVY1dpuL+gDSnCGObcQ2Y4qPioi9973RNLAsu//jrtjJkIYMUs5eQEXN\n8IGPxv9NAgMBAAECgf82fMzYTZHmpnilxurCMe/yQMQ+VgEvS3gBbA/nbo0Orgkl\nCXNH2fB/5nXsgb4Xp37C7KI3PPMj6b0Emtt3JRpeszQlM0Zsl7eeDKDr3I84xQar\nhCOtlLFaJuTDDB7i7T0S6u1MLJf2cLWlnV7X97rQRAf8+glC4EvCZP7tD1A0hEll\nW6LM1Hu64dkxftnu8EJw0DPY6gckeekt7lAn0s6zGIdUnEZFYGbktQ2z6h8bIOc8\n8hVrAgu8smTnr1DF6m211FMZ2fqVvxp0H9uSJCbpZG3B4drf6+wxcJVmYXwUo425\npL/9VerIWrBkZbrdwJ/K6L+08J5B261gOecArmECgYEA98KGE73eI5n5Xgvkr5n3\nK0x1zmpYhVHj9HlVeKyDzL/sI2jEHpqKcbIpylmXGLoT9ZSQDi6eDZ4aoCckHZsJ\noykB8MXJKl8umdohCdwp3JkhAf9zKacRdNAT1uQ31sA8+8d36KdsqsaWkNJ2GGnr\nklgNTlQiJDQH9vBz5N1zVi0CgYEAxVzGLh/V0FDpz+FG8X4pRAlICzMCLpucqz8i\n725rjH99WApBel4k1D+/kWbyKnbDyWJ9YoHGXQ+gRCWi7c54MoMTZp8XC1TVLZM5\nFuxvAAsFSwUcqS3YzQtKqB96ZcIPTSPjY1iOUppE1MaLMmgzGITe5bZcH5cSRORA\nh6PqIaECgYAW2V28HFqMNfsFbVtdxnlBCQAkVTJsuSyoszfqtR5Cl8CTU2oi2GXE\nLoYkHzcMFL0afOT8KdhxsQ8LjhCKmm29Gl8PcW4n9jc6AR/i5OcHbSfaI1DfmoTF\nnRr3SnzL1VbKcY7hae9foIjqOj6h6cLL8Erp2mB7rkC9yVcm2DV20QKBgCICK5A1\nIiXkW3Xbztq8L6Yup0BuyLh5ThTgK0fw0g2CxnmOQtwwLs54Ma1/fMk+b9xa4VpB\nHIpar/YuOhYaVvH1TjmHvnPQaW+SB+tgUHxEaeQUfGzWnp4ujO3NhszUFMjpHzy2\nPMgVFzlHASNteyiFdNdGhjdXU+mVH12ALE8hAoGAHKypEhzizXvpJ24edJSESMIF\nlwkgk4OUehbTST8GXttWDJl4kIMaGmtWh9oUSEsTjm7IIbB2JMm8UhQR40QnReqC\ny6Mo0f7kXwjmaWjjcxymOCwM9g34EnY3ZwjqKey1G+Vo/YPcA/3xR//tj0Fs7nG8\nEbtTWGMD5YDu7Cko1vY=\n-----END PRIVATE KEY-----\n"
    app.config["TESTING"] = True

    response = app.test_client().get("/googleTranslate/hallo")

    assert response.status_code == 500


@unittest.mock.patch("google.cloud.translate_v2.Client.translate", unittest.mock.MagicMock(return_value={ "input": "hund", "translatedText": "dog" }))
def test_returns_translation_of_given_word():
    os.environ["GOOGLE_AUTH_CLIENT_EMAIL"] = "<client_email>"
    os.environ["GOOGLE_AUTH_PRIVATE_KEY"] = "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQC/Anrid6sGUoQc\nhmjmlqUPXuiFLfRjND6YG4CblbQCXgBbyZul6fxch2hBtjBBqKtHraRfwd7bANcn\nFRUupo6cFXxj9cnn+LSvoEQPWc9o28THYM3yv/YHDQiPIS7M2WQBt1xigkvZKygh\n2t0XSipF5lU3oQwIQv/896TPzKVMb1rbQK8XU8QGQ/QO5kJ889TdDn32kd3mgX4W\nXqxgWwNxg2e3SGAs66r+RXv1yTTZ4vn+aQehOxmlIqrQ5pab4cZWz3Nji6z1wQ4k\nPhqm5sO0LVY1dpuL+gDSnCGObcQ2Y4qPioi9973RNLAsu//jrtjJkIYMUs5eQEXN\n8IGPxv9NAgMBAAECgf82fMzYTZHmpnilxurCMe/yQMQ+VgEvS3gBbA/nbo0Orgkl\nCXNH2fB/5nXsgb4Xp37C7KI3PPMj6b0Emtt3JRpeszQlM0Zsl7eeDKDr3I84xQar\nhCOtlLFaJuTDDB7i7T0S6u1MLJf2cLWlnV7X97rQRAf8+glC4EvCZP7tD1A0hEll\nW6LM1Hu64dkxftnu8EJw0DPY6gckeekt7lAn0s6zGIdUnEZFYGbktQ2z6h8bIOc8\n8hVrAgu8smTnr1DF6m211FMZ2fqVvxp0H9uSJCbpZG3B4drf6+wxcJVmYXwUo425\npL/9VerIWrBkZbrdwJ/K6L+08J5B261gOecArmECgYEA98KGE73eI5n5Xgvkr5n3\nK0x1zmpYhVHj9HlVeKyDzL/sI2jEHpqKcbIpylmXGLoT9ZSQDi6eDZ4aoCckHZsJ\noykB8MXJKl8umdohCdwp3JkhAf9zKacRdNAT1uQ31sA8+8d36KdsqsaWkNJ2GGnr\nklgNTlQiJDQH9vBz5N1zVi0CgYEAxVzGLh/V0FDpz+FG8X4pRAlICzMCLpucqz8i\n725rjH99WApBel4k1D+/kWbyKnbDyWJ9YoHGXQ+gRCWi7c54MoMTZp8XC1TVLZM5\nFuxvAAsFSwUcqS3YzQtKqB96ZcIPTSPjY1iOUppE1MaLMmgzGITe5bZcH5cSRORA\nh6PqIaECgYAW2V28HFqMNfsFbVtdxnlBCQAkVTJsuSyoszfqtR5Cl8CTU2oi2GXE\nLoYkHzcMFL0afOT8KdhxsQ8LjhCKmm29Gl8PcW4n9jc6AR/i5OcHbSfaI1DfmoTF\nnRr3SnzL1VbKcY7hae9foIjqOj6h6cLL8Erp2mB7rkC9yVcm2DV20QKBgCICK5A1\nIiXkW3Xbztq8L6Yup0BuyLh5ThTgK0fw0g2CxnmOQtwwLs54Ma1/fMk+b9xa4VpB\nHIpar/YuOhYaVvH1TjmHvnPQaW+SB+tgUHxEaeQUfGzWnp4ujO3NhszUFMjpHzy2\nPMgVFzlHASNteyiFdNdGhjdXU+mVH12ALE8hAoGAHKypEhzizXvpJ24edJSESMIF\nlwkgk4OUehbTST8GXttWDJl4kIMaGmtWh9oUSEsTjm7IIbB2JMm8UhQR40QnReqC\ny6Mo0f7kXwjmaWjjcxymOCwM9g34EnY3ZwjqKey1G+Vo/YPcA/3xR//tj0Fs7nG8\nEbtTWGMD5YDu7Cko1vY=\n-----END PRIVATE KEY-----\n"
    app.config["TESTING"] = True

    response = app.test_client().get("/googleTranslate/hund")

    print(response.charset)
    assert response.status_code == 200
    assert response.get_data(as_text=True) == "dog"
