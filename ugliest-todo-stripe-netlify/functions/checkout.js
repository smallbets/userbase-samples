const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const request = require('request-promise-native')

exports.handler = async (event, context) => {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      event.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (stripeEvent.type === 'checkout.session.completed') {
      const eventObject = stripeEvent.data.object
      const userId = eventObject.client_reference_id
      const customerId = eventObject.customer

      // set payment flag on user's protected profile
      await request({
        method: 'POST',
        uri: 'https://v1.userbase.com/v1/admin/users/' + userId,
        auth: {
          bearer: process.env.USERBASE_ADMIN_API_ACCESS_TOKEN
        },
        json: true,
        body: {
          protectedProfile: {
            paymentStatus: 'paid',
            customerId
          }
        }
      }).promise()
    }

    console.log(`Stripe webhook succeeded`)

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    }
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`)

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    }
  }
}
