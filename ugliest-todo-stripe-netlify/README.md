# Ugliest Todo using Netlify Functions & Stripe

## Overview

This sample project uses Stripe's [client-only Checkout](https://stripe.com/docs/payments/checkout/client-only) to charge for a [one-time product](https://stripe.com/docs/payments/checkout/client) or a [recurring subscription](https://stripe.com/docs/payments/checkout/client-subscription) and uses [Netlify Functions](https://www.netlify.com/products/functions/) to handle the payment succeeded webhook to the update our Userbase user status to paid.

## Setup

### Runing locally

1. Create your `.env` file and add your secrets:

```shell
cp .env.example .env
```

2. Add your client-side identifiers to the [public/client_config.js](public/client_config.js) file.

**Note:** make sure not to mix up the public identifiers in the `client_confi.js` with the secret keys in the `.env` file. The content of the `.env` file needs to be kept secret and never commited to git. That's why we have `.env` in our [.gitignore](.gitignore) file.

3. Install the [Stripe CLI](https://github.com/stripe/stripe-cli#installation) & [login](https://github.com/stripe/stripe-cli/wiki/login-command) with your Stripe account.

4. Start the webhook event forwarding:

```shell
stripe listen --forward-to http://localhost:34567/checkout
```

**Note:** The Stripe CLI will return your webhook signing secret: `whsec_1234`. Copy the secret and paste it into your `.env` file.

5. In a separate terminal window, [install the Netlify cli](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md#netlify-functions)

6. Install the dependencies for the function:

```shell
npm install
```

6. Run the Netlify dev server

```shell
netlify dev
```

🎉 Watch your terminal windows for webhook events and error logs.

### 💫 Deploy with Netlify

Your Netlify Function will have the following URL shape (`https://your-project-name.netlify.com/.netlify/functions/checkout`). Use this to create a live webhook endpoint [in your Stripe dashboard](https://stripe.com/docs/webhooks/setup#configure-webhook-settings).

Your live webhook will have a different signing secret, which you can retrieve from the webhook details page. Use this secret in your Netlify deploy settings (you will be prompted to enter it when hitting the deploy button below).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://github.com/encrypted-dev/userbase-samples/tree/master/ugliest-todo-stripe-netlify)

**Note:** Hitting the "Deploy to Netlify Button" will create a repository on your GitHub account. You will then need to modify the [public/client_config.js](public/client_config.js) file with your public identifiers and commit these changes to master. Netlify will then automatically redeploy and you're ready to go 🎉

### Deploy manually

Alternatively, if you've already got the project set up locally, you can deploy manually by running:

```shell
netlify deploy --prod --functions=functions
```

**Note:** when deploying manually, you will need to set up your secrets manually in the [Netlify build settings](https://app.netlify.com/sites/userbase-with-stripe/settings/deploys#environment-variables).
