import { gql } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'

import { App } from '@core/globals'
import _ from 'lodash'
import SgMailHelper from '@helpers/send-grid.helper'
import TwilioHelper from '@helpers/twilio.helper'

export const ResendCode = gql`
  extend type Mutation {
    resendCode(input: ResendCodeInput!): ResendCodeMutPayload!
  }

  input ResendCodeInput {
    email: String
    mobile: String
    referenceCode: String!
    codeType: VerificationCodeType!
  }

  type ResendCodeMutPayload {
    message: String!
    referenceCode: String!
  }

  enum VerificationCodeType {
    email
    twoFA
    resetPassword
  }
`

export const resendCodeResolver = {
  Mutation: {
    resendCode: async (_parent, args, _context, _info) => {
      const { email, mobile, referenceCode, codeType } = args.input

      if (!email && !mobile) {
        throw new UserInputError('Invalid credentials!')
      }

      // Fetch user
      const query = _.pickBy({ email, mobile, isActive: true }, _.identity)
      const user = await App.Models.User.findOne(query, '+verification')

      // Check if referenceCode is valid
      const verificationObj = _.find(user.verification, ['codeType', codeType])

      if (!verificationObj || verificationObj.referenceCode !== referenceCode) {
        throw new UserInputError('Invalid input!')
      }

      if (codeType === 'email') {
        // Delete old verification object.
        await user['deleteVerificationCode']('email')
        // Create new verification object.
        await user['createEmailVerificationId']()
        await user.save()

        const verificationEmail = _.findLast(user.verification, [
          'codeType',
          'email',
        ])

        const verifyEmailUrl = `${App.Config.GATEWAY_URL}?query={verifyEmail(email: "${email}", id: "${verificationEmail.code}")}`

        // Send Email with Email Verification Url
        SgMailHelper.send({
          to: email,
          from: App.Config.SENDGRID_DEFAULT_SENDER_EMAIL,
          subject: 'Email Verification',
          text: `Verify you email by going to: ${verifyEmailUrl}`,
          html: `<button><a href="${verifyEmailUrl}" target="_blank">Verify Email</a></button>`,
        })

        return {
          message: 'Resend verification code successful.',
          referenceCode: verificationEmail.referenceCode,
        }
      }

      if (codeType === 'twoFA') {
        // Delete old verification object.
        await user['deleteTwoFACode']()
        // Create new twoFA code
        await user['createTwoFACode']()
        await user.save()

        const verificationTwoFA = _.findLast(user.verification, [
          'codeType',
          'twoFA',
        ])

        // Send message with verification code.
        await TwilioHelper.SendMessage({
          body: `Verification code for your e-commerce login is ${verificationTwoFA.code}`,
          to: user.mobile,
        })

        return {
          message: 'Two FA created successfully.',
          referenceCode: verificationTwoFA.referenceCode,
        }
      }

      if (codeType === 'resetPassword') {
        // Delete old verification object.
        await user['deleteResetPasswordCode']()
        // Create new reset password code
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
          message: 'Reset password code sent successfully.',
          referenceCode: verificationObj.referenceCode,
        }
      }
    },
  },
}
