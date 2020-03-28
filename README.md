# Norwegian Dictionary

A Norwegian dictionary aggregator that collects definitions and translations for Norwegian words onto a single web page.

## Prerequisites

- Python 3.6
- Pipenv
- Node 12
- heroku CLI
- Postgresql

Other versions may work, but have not been tested.

## Developing

To prepare the project locally for development:
```shell
# Download a local copy of the codebase.
git clone https://github.com/tombjerkan/norwegian-dictionary.git
cd norwegian-dictionary

# Install the dependencies for the server.
cd server
pipenv install

# Install the dependencies for the web client.
cd ../client
npm install
```

To start the development servers, run from two separate terminals:
```
# Window 1 (from <root>/server directory)
export FLASK_ENV=development
export FLASK_APP=server
pipenv run flask run

# Window 2 (from <root>/client directory)
npm start
```

The website can now be accessed on `localhost:3000`.

## Deploying

To deploy to Heroku:

```shell
# Ensure you are logged in to the deployment Heroku account
heroku login

# Set-up the Heroku remote for your local repository
heroku git:remote -a peaceful-castle-58905

# Publish local commits to the Heroku server.
git push heroku master
```

## Configuration

The local environment must have the variables `GOOGLE_AUTH_CLIENT_EMAIL` and `GOOGLE_AUTH_PRIVATE_KEY` set in order for the Google Translate API to work.

For local development, place these in a `<root>/server/.env` file:

```
GOOGLE_AUTH_CLIENT_EMAIL=<email>
GOOGLE_AUTH_PRIVATE_KEY=<private-key>
```

For production, set these as [Config Vars](https://devcenter.heroku.com/articles/config-vars) in Heroku.

Follow the instructions in the [Google Cloud documentation](https://cloud.google.com/translate/docs/quickstart-client-libraries-v3) to set-up an account.
