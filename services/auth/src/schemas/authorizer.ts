import { gql } from 'apollo-server-express'
import { ApolloError } from 'apollo-server-errors'

import { Logger } from '@core/globals'
import JWTHelper from '@helpers/jwt.helper'

export const Authorizer = gql`
  extend type Query {
    authorizer: User
  }
`

export const authorizerResolver = {
  Query: {
    authorizer: async (_parent, _args, context, _info) => {
      try {
        const { req } = context
        if (!req.headers.authorization) {
          return null
        }
        const token = req.headers.authorization.split(' ')[1]
        const user = await JWTHelper.GetUser({ token })

        return user
      } catch (error) {
        Logger.error(error)
        throw new ApolloError(
          error?.message ?? 'Oops! Something went wrong',
          'INTERNAL_SERVER_ERROR',
          error
        )
      }
    },
  },
}
