const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const request = require('request-promise-native')

// Set cors headers
const headers = {
  // We're allowing all origins for testing, you should limit this in production.
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
}

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST' || !event.body) {
      return {
        statusCode: 200,
        headers,
        body: ''
      }
    }

    // Parse the body contents into an object.
    const data = JSON.parse(event.body)
    const { userId } = data

    // Retrieve our user's protectedProfile
    const user = await request({
      method: 'GET',
      uri: `https://v1.userbase.com/v1/admin/users/${userId}`,
      auth: {
        bearer: process.env.USERBASE_ADMIN_API_ACCESS_TOKEN
      },
      json: true
    }).promise()

    // Cancel the subscription in Stripe
    await stripe.subscriptions.del(user.protectedProfile.subscriptionId)

    // Update the user's profile
    await request({
      method: 'POST',
      uri: `https://v1.userbase.com/v1/admin/users/${userId}`,
      auth: {
        bearer: process.env.USERBASE_ADMIN_API_ACCESS_TOKEN
      },
      json: true,
      body: {
        protectedProfile: {
          subscriptionStatus: 'cancelled'
        }
      }
    }).promise()

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ subscriptionStatus: 'cancelled' })
    }
  } catch (error) {
    console.log(`Error cancelling subscription: ${error}`)

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error })
    }
  }
}
