import { gql } from 'apollo-server-express'
import { AuthenticationError } from 'apollo-server-errors'
import _ from 'lodash'

import RegexQueryGenerator from '@helpers/regex-query-generator.helper'
import Paginator from '@helpers/pagination.helper'

export const GetProducts = gql`
  extend type Query {
    getProducts(input: GetProductsInput!): GetProductsQueryPayload!
  }

  input GetProductsInput {
    startIndex: Int
    itemsPerPage: Int
    name: String
    description: String
  }

  type GetProductsQueryPayload {
    message: String!
    totalItems: Int!
    startIndex: Int!
    itemsPerPage: Int!
    items: [Product!]!
  }
`

export const getProductsResolver = {
  Query: {
    getProducts: async (_parent, args, context, _info) => {
      const { user: __user } = context
      if (!__user?.role) {
        throw new AuthenticationError(
          'You are not authorized to fetch products!'
        )
      }

      const { startIndex, itemsPerPage, name, description } = args.input

      // Create the fetch query
      const query = await RegexQueryGenerator.Generate({
        searchFields: _.pickBy(
          {
            name,
            description,
            isActive: true,
          },
          _.identity
        ),
        excludeRegex: ['isActive'],
      })
      const result = await Paginator.Paginate({
        model: 'product',
        query,
        startIndex: startIndex ? +startIndex : undefined,
        itemsPerPage: itemsPerPage ? +itemsPerPage : undefined,
      })

      return {
        message: 'Products fetched successfully!',
        ...result,
      }
    },
  },
}
