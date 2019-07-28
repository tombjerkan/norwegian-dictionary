const { Router } = require("express");
const { TranslationServiceClient } = require("@google-cloud/translate").v3beta1;
const { FetchError } = require("node-fetch");
const { withAsyncErrorHandling, ApiError } = require("./errorHandling");

const router = Router();

router.get(
    "/googleTranslate/:word",
    withAsyncErrorHandling(async (req, res) => {
        const translationClient = new TranslationServiceClient({
            credentials: {
                client_email: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_AUTH_PRIVATE_KEY
            }
        });

        try {
            const [response] = await translationClient.translateText({
                parent: translationClient.locationPath(
                    "norsk-dictionary-1563830111515",
                    "global"
                ),
                contents: [req.params.word],
                mimeType: "text/plain",
                sourceLanguageCode: "nb-NO",
                targetLanguageCode: "en-US"
            });

            res.json(response.translations[0].translatedText);
        } catch (err) {
            if (err instanceof FetchError) {
                throw new ApiError(503);
            } else {
                throw err;
            }
        }
    })
);

module.exports = router;
