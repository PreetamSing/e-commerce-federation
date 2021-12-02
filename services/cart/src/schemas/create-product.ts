import { gql } from 'apollo-server-express'
import { AuthenticationError } from 'apollo-server-errors'

import { App } from '@core/globals'
import { Role } from '@core/constants/roles'

export const CreateProduct = gql`
  extend type Mutation {
    createProduct(input: CreateProductInput!): CreateProductMutPayload!
  }

  input CreateProductInput {
    name: String!
    description: String
    price: Int!
    currency: String
  }

  type CreateProductMutPayload {
    message: String!
    product: Product!
  }
`

export const createProductResolver = {
  Mutation: {
    createProduct: async (_parent, args, context, _info) => {
      const { user: __user } = context
      if (__user?.role !== Role.SUPER_ADMIN) {
        throw new AuthenticationError(
          'You are not authorized to create a product!'
        )
      }

      const { name, description, price, currency } = args.input
      const product = new App.Models.Product({
        name,
        description,
        price,
        currency,
        _createdBy: __user._id.toString(),
      })

      await product.save()

      return {
        message: 'Product created successfully',
        product,
      }
    },
  },
}
