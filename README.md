# Norwegian Dictionary

A Norwegian dictionary aggregator that collects definitions and translations for Norwegian words onto a single web page.

## Prerequisites

- Python (v. 3.9)
- Node (v. 12)
- AWS SAM CLI (v. 1.66)
- Docker (v. 20.10)

Other versions may work, but have not been tested.

## Developing

To prepare the project locally for development:
```shell
# Download a local copy of the codebase.
git clone https://github.com/tombjerkan/norwegian-dictionary.git
cd norwegian-dictionary

# Install the dependencies for the web client.
cd ../client
npm install
```

To start the development servers, run from two separate terminals:
```
# Window 1 (from <root>/server directory)
./scripts/run-local

# Window 2 (from <root>/client directory)
npm start
```

The website can now be accessed on `localhost:3000`.

## Deploying

Ensure you are authorised locally with the AWS CLI.

To deploy to AWS:

```shell
./scripts/deploy
```

## Configuration

The local environment must have the variables `GOOGLE_AUTH_CLIENT_EMAIL` and `GOOGLE_AUTH_PRIVATE_KEY` set in order for the Google Translate API to work.

For local development, place these in a `<root>/server/.env` file:

```
GOOGLE_AUTH_CLIENT_EMAIL=<email>
GOOGLE_AUTH_PRIVATE_KEY=<private-key>
```

For production, these values will be included in the deployment when the deployment script is run.

Follow the instructions in the [Google Cloud documentation](https://cloud.google.com/translate/docs/quickstart-client-libraries-v3) to set-up an account.
