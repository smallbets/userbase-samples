const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY)
const request = require('request-promise-native')

exports.handler = async (req, context) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (event.type === 'checkout.session.completed') {
      const userId = event.data.object.client_reference_id

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
            paymentStatus: 'paid' 
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
