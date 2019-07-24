const { Router } = require("express");
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const { handleAsyncErrors } = require("./errorHandling");

const router = Router();

const translationClient = new TranslationServiceClient({
    credentials: {
        client_email: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_AUTH_PRIVATE_KEY
    }
});

router.get("/googleTranslate/:word", handleAsyncErrors(async (req, res) => {
    const [response] = await translationClient.translateText({
        parent: translationClient.locationPath("norsk-dictionary-1563830111515", "global"),
        contents: [req.params.word],
        mimeType: 'text/plain',
        sourceLanguageCode: 'nb-NO',
        targetLanguageCode: 'en-US'
    });

    res.json(response.translations[0].translatedText);
}));

module.exports = router;
