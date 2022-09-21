# Tweeply

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

- Run the TypeScript script to generate JS files

```bash
yarn run tsc
# or
yarn run tsc:w # to recompile on change
```

- Run the app on development mode: `yarn dev`

## Contributing

You can help to the development of Tweeply by simple cloning and repo, making some changes and opening a Pull Request. I will check it as soon as possible and let you know how to continue with it.

Of course, you can always just create an issue and I (or anyone else) will try to give it a look as soon as possible.
