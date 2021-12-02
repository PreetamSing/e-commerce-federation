import { gql } from 'apollo-server-express'
import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import _ from 'lodash'

import { App } from '@core/globals'
import { Role } from '@core/constants/roles'
import StripeHelper from '@helpers/stripe.helper'

export const BuyProduct = gql`
  extend type Mutation {
    buyProduct(input: BuyProductInput!): BuyProductMutPayload!
  }

  input BuyProductInput {
    paymentMethodType: String!
    productId: ID!
  }

  type BuyProductMutPayload {
    message: String!
    clientSecret: String!
  }
`

export const buyProductResolver = {
  Mutation: {
    buyProduct: async (_parent, args, context, _info) => {
      const { user: __user } = context
      if (__user?.role !== Role.USER) {
        throw new AuthenticationError('You are not authorized to buy products!')
      }

      const { paymentMethodType, productId: _product } = args.input
      const product = await App.Models.Product.findById(_product)

      if (!product) {
        throw new UserInputError('Invalid product id!')
      }

      const paymentIntent = await StripeHelper.CreatePaymentIntent(
        product.price,
        product.currency,
        paymentMethodType
      )

      // Return bad request error if an error occurred in creating payment intent.
      if (paymentIntent?.error) {
        throw new UserInputError(paymentIntent.error)
      }

      const purchase = new App.Models.Purchase({
        _user: __user._id.toString(),
        _product: product._id.toString(),
        paymentIntentId: paymentIntent.id,
        currency: product.currency,
      })

      // Save the purchase. This payment intent hasn't been confirmed yet.
      await purchase.save()

      return {
        message: 'Payment intent created successfully for purchase!',
        clientSecret: paymentIntent.client_secret,
      }
    },
  },
}
