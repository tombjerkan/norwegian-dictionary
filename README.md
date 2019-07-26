# Norwegian Dictionary

A Norwegian dictionary aggregator that collects definitions and translations for Norwegian words onto a single web page.

## Developing

To prepare the project locally for development:
```shell
# Download a local copy of the codebase.
git clone https://github.com/tombjerkan/norwegian-dictionary.git

# Install the dependencies for the server.
cd norwegian-dictionary
npm install

# Install the dependencies for the web client.
cd client
npm install
```

To start the development servers, run `npm start` in different terminal windows from both the root directory and the `client` directory.

The website can now be accessed on `localhost:3000`.

## Deploying

To deploy to Heroku:

```shell
# Ensure you are logged in to the deployment Heroku account
heroku login

# Publish local commits to the Heroku server.
git push heroku master
```

## Configuration

The local environment must have the variables `GOOGLE_AUTH_CLIENT_EMAIL` and `GOOGLE_AUTH_PRIVATE_KEY` set in order for the Google Translate API to work.

For local development, place these in a `.env` file in the root of the project:

```
GOOGLE_AUTH_CLIENT_EMAIL=<email>
GOOGLE_AUTH_PRIVATE_KEY=<private-key>
```

For production, set these as [Config Vars](https://devcenter.heroku.com/articles/config-vars) in Heroku.

Follow the instructions in the [Google Cloud documentation](https://cloud.google.com/translate/docs/quickstart-client-libraries-v3) to set-up an account.
