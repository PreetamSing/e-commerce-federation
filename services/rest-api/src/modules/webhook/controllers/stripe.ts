import '@core/declarations'
import StripeHelper from '@helpers/stripe.helper'
import axios from 'axios'
import { Request, Response } from 'express'
import { Accounts } from 'web3-eth-accounts'

export default async function _Stripe(req: Request, res: Response) {
  // Retrieve the event by verifying the signature using the raw body and secret.
  const paymentIntent = await StripeHelper.WebhookEventVerify(
    req.body,
    req.headers['stripe-signature']
  )

  // Return success and do nothing if paymentIntent is null
  if (paymentIntent === null) {
    return res.success()
  }

  // Return bad request error if an error occurred in webhook verification.
  if (paymentIntent?.error) {
    return res.badRequest({ error: paymentIntent.error })
  }

  if (paymentIntent.status !== 'succeeded') {
    res.success()
  }

  try {
    const instance = new Accounts()
    await axios.post(App.Config.CART_URL, {
      query:
        'mutation ($id: ID!, $sign: String!, $amountReceived: Int!) { updatePurchase(id: $id, sign: $sign, amountReceived: $amountReceived) }',
      variables: {
        id: paymentIntent.id,
        sign: JSON.stringify(
          instance.sign('rest-api', App.Config.SERVICE_PRIVATE_KEY)
        ),
        amountReceived: paymentIntent.amount_received,
      },
    })
    return res.success()
  } catch (error) {
    return res.badRequest({ error: error })
  }
}
