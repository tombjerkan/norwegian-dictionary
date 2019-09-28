const express = require("express");
const translate = require("@google-cloud/translate");
const supertest = require("supertest");
const { router } = require(".");

const app = express();
app.use("/", router);

const environmentVariables = process.env;

beforeEach(() => {
    translate.__reset();
    process.env = { ...environmentVariables };
});

test("returns translation of given word", async () => {
    process.env.GOOGLE_AUTH_CLIENT_EMAIL = "thomas@email.com";
    process.env.GOOGLE_AUTH_PRIVATE_KEY = "private-key";

    translate.__setValidCredentials({
        client_email: "thomas@email.com",
        private_key: "private-key"
    });
    translate.__addTranslation("hund", "dog");

    const response = await supertest(app).get("/googleTranslate/hund");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("dog");
});

test("returns Service Unavailable (503) if network error", async () => {
    process.env.GOOGLE_AUTH_CLIENT_EMAIL = "thomas@email.com";
    process.env.GOOGLE_AUTH_PRIVATE_KEY = "private-key";

    translate.__setValidCredentials({
        client_email: "thomas@email.com",
        private_key: "private-key"
    });
    translate.__makeServiceUnavailable();

    const response = await supertest(app).get("/googleTranslate/katt");

    expect(response.statusCode).toBe(503);
});

test("returns Internal Server Error (500) if credentials are invalid", async () => {
    process.env.GOOGLE_AUTH_CLIENT_EMAIL = "simon@email.com";
    process.env.GOOGLE_AUTH_PRIVATE_KEY = "other-key";

    translate.__setValidCredentials({
        client_email: "thomas@email.com",
        private_key: "private-key"
    });

    const response = await supertest(app).get("/googleTranslate/fisk");

    expect(response.statusCode).toBe(500);
});
