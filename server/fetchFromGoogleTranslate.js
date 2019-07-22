const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;

const translationClient = new TranslationServiceClient();

async function fetchFromGoogleTranslate(word) {
    const [response] = await translationClient.translateText({
        parent: translationClient.locationPath("norsk-dictionary-1563830111515", "global"),
        contents: [word],
        mimeType: 'text/plain',
        sourceLanguageCode: 'nb-NO',
        targetLanguageCode: 'en-US'
    });

    return response.translations.map(translation => translation.translatedText);
}

module.exports = fetchFromGoogleTranslate;
