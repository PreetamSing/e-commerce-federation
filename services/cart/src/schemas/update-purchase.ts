import { gql } from 'apollo-server-express'
import { AuthenticationError, UserInputError } from 'apollo-server-errors'
import { Accounts } from 'web3-eth-accounts'

import { App, Logger } from '@core/globals'

export const UpdatePurchase = gql`
  extend type Mutation {
    updatePurchase(id: ID!, sign: String!, amountReceived: Int!): String
  }
`

export const updatePurchaseResolver = {
  Mutation: {
    updatePurchase: async (_parent, args, _context, _info) => {
      const { id, sign, amountReceived } = args
      const instance = new Accounts()
      const signObj = JSON.parse(sign)

      const signee = instance.recover(signObj)

      if (signee !== App.Config.REST_API_ADDRESS) {
        throw new AuthenticationError('Unauthorized!')
      }

      const purchase = await App.Models.Purchase.findOne({
        paymentIntentId: id,
      })

      if (!purchase) {
        throw new UserInputError('Purchase not found!')
      }

      if (amountReceived !== purchase.amount) {
        Logger.error('Did not receive complete payment!')
      }

      purchase.isAmountReceived = true
      await purchase.save()

      return 'Purchase updated successfully!'
    },
  },
}
