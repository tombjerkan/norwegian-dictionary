const { Router } = require("express");
const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

const router = Router();

const translationClient = new TranslationServiceClient({
    credentials: {
        client_email: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_AUTH_PRIVATE_KEY
    }
});

router.get("/googleTranslate/:word", async (req, res) => {
    try {
        const [response] = await translationClient.translateText({
            parent: translationClient.locationPath("norsk-dictionary-1563830111515", "global"),
            contents: [req.params.word],
            mimeType: 'text/plain',
            sourceLanguageCode: 'nb-NO',
            targetLanguageCode: 'en-US'
        });

        if (response.translations.length === 0) {
            next(404);
            return;
        }
    
        res.json(response.translations.map(translation => translation.translatedText));
    } catch (err) {
        next(500);
    }
});

module.exports = router;
