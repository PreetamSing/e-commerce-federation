import { gql } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'

import { App } from '@core/globals'
import _ from 'lodash'
import TwilioHelper from '@helpers/twilio.helper'

export const ResetPassword = gql`
  extend type Mutation {
    resetPassword(input: ResetPasswordInput!): ResetPasswordMutPayload!
  }

  input ResetPasswordInput {
    reqType: ResetPasswordReqType!
    mobile: String!
    code: String
    newPassword: String
  }

  type ResetPasswordMutPayload {
    message: String!
    referenceCode: String
  }

  enum ResetPasswordReqType {
    REQUEST
    twoFA
  }
`

export const resetPasswordResolver = {
  Mutation: {
    resetPassword: async (_parent, args, _context, _info) => {
      const { reqType, mobile, code, newPassword } = args.input

      const user = await App.Models.User.findOne(
        { mobile, isActive: true },
        '+verification'
      )

      if (!user) {
        throw new UserInputError('Invalid credentials!')
      }

      if (reqType === 'REQUEST') {
        // Create new reset-password code
        await user['createResetPasswordCode']()
        await user.save()

        const verificationObj = _.findLast(user.verification, [
          'codeType',
          'resetPassword',
        ])

        // Send message with verification code.
        await TwilioHelper.SendMessage({
          body: `Verification code for your e-commerce reset password request is ${verificationObj.code}`,
          to: user.mobile,
        })

        return {
          message: 'Reset Password code sent successfully.',
          referenceCode: verificationObj.referenceCode,
        }
      }

      if (!code || !newPassword) {
        throw new UserInputError('Invalid input!')
      }

      const verificationObj = _.findLast(user.verification, [
        'codeType',
        'resetPassword',
      ])

      if (!verificationObj || verificationObj.code !== code) {
        throw new UserInputError('Invalid input!')
      }

      await user['deleteResetPasswordCode']()
      user.password = newPassword
      await user.save()

      return { message: 'Password Reset successful!' }
    },
  },
}
