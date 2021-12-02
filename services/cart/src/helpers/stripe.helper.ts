import Stripe from 'stripe'

import { App } from '@core/globals'

class StripeHelper {
  private stripe = new Stripe(App.Config.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    typescript: true,
  })

  async CreatePaymentIntent(
    amount: number,
    currency: string,
    paymentMethodType: string
  ): Promise<any> {
    // Create a PaymentIntent with the order amount and currency.
    const params: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    }

    // If this is for an ACSS payment, we add payment_method_options to create
    // the Mandate.
    if (paymentMethodType === 'acss_debit') {
      params.payment_method_options = {
        acss_debit: {
          mandate_options: {
            payment_schedule: 'sporadic',
            transaction_type: 'personal',
          },
        },
      }
    }

    try {
      const paymentIntent: Stripe.PaymentIntent =
        await this.stripe.paymentIntents.create(params)

      // Return payment intent
      return paymentIntent
    } catch (e) {
      return { error: e.message }
    }
  }

  /**
   * @dev Returns PaymentIntent on successful payment or failed payment,
   *  error on failed verification, and null in any other case.
   */
  async WebhookEventVerify(payload: any, stripeSignature: any): Promise<any> {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event: Stripe.Event

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        stripeSignature,
        App.Config.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      // Return an error object on failed verification.
      return { error: 'Webhook signature verification failed.' }
    }

    // Extract the data from the event.
    const data: Stripe.Event.Data = event.data
    const eventType: string = event.type

    if (eventType === 'payment_intent.succeeded') {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent
      // Funds have been captured
      return pi
    } else if (eventType === 'payment_intent.payment_failed') {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent
      return pi
    }
    return null
  }
}

export default new StripeHelper()
