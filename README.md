# Swift Reply

To help Twitter Content Creators reply to all replies on their tweets 10x faster (no need for a mouse).

## Getting Started

- First, you'll need to get a API Key and API Secret from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)

- Create a `.env` file at the root of the project with the following env var:

```bash
PORT=<port you want the app to run in>
COOKEY_SECRET=<any secret for cookie parsing>
TWITTER_API_KEY=<your Twitter API Key>
TWITTER_API_SECRET=<your Twitter API Secret>
TWITTER_API_BEARER=<your Twitter Bearer Token>
TWITTER_CALLBACK_URL=http://localhost:<port>/api/auth/twitter-callback # this url must also be set under your Twitter Project in the Twitter Developer Portal
```

- Install dependencies: `yarn install`

- Run the TypeScript script to generate JS files"

```bash
yarn run tsc
# or
yarn run tsc:w # to keep watching for changes
```

- Run the app on development mode: `yarn dev`
