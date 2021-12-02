import { gql } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'

import { App } from '@core/globals'
import _ from 'lodash'

export const VerifyEmail = gql`
  extend type Mutation {
    verifyEmail(email: String!, id: String!): String!
  }
`

export const verifyEmailResolver = {
  Mutation: {
    verifyEmail: async (_parent, args, _context, _info) => {
      const { email, id } = args

      const user = await App.Models.User.findOne(
        { email, isActive: true },
        '+verification'
      )

      if (!user) {
        throw new UserInputError('Email verification failed!')
      }

      const verificationEmail = _.findLast(user.verification, [
        'codeType',
        'email',
      ])

      if (!verificationEmail || verificationEmail.code !== id) {
        throw new UserInputError('Email verification failed!')
      }

      await user['deleteVerificationCode']('email')
      user.emailVerifiedAt = new Date()
      await user.save()

      return 'Email verification successful!'
    },
  },
}
