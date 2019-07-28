const _ = require("lodash");
const { FetchError } = require("node-fetch");

const translate = jest.genMockFromModule("@google-cloud/translate");

class TranslationServiceClient {
    constructor({ credentials }) {
        this.credentials = credentials;
    }

    async translateText({ contents }) {
        if (!isServiceAvailable) {
            throw new FetchError("", "");
        }

        if (!_.isEqual(this.credentials, validCredentials)) {
            throw new Error();
        }

        return [
            {
                translations: [
                    {
                        translatedText: translations[contents[0]]
                    }
                ]
            }
        ];
    }

    locationPath() {
        return "";
    }
}

const validCredentials = {
    client_email: null,
    private_key: null
};

function __setValidCredentials({ client_email, private_key }) {
    validCredentials.client_email = client_email;
    validCredentials.private_key = private_key;
}

let isServiceAvailable = true;

function __makeServiceUnavailable() {
    isServiceAvailable = false;
}

let translations = {};

function __addTranslation(norwegian, english) {
    translations[norwegian] = english;
}

function __reset() {
    validCredentials.client_email = null;
    validCredentials.private_key = null;
    isServiceAvailable = true;
    translations = {};
}

translate.v3beta1.TranslationServiceClient = TranslationServiceClient;
translate.__setValidCredentials = __setValidCredentials;
translate.__makeServiceUnavailable = __makeServiceUnavailable;
translate.__addTranslation = __addTranslation;
translate.__reset = __reset;

module.exports = translate;
