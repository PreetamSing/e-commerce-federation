import { gql } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'

import { App } from '@core/globals'
import { Role } from '@core/constants/roles'
import SgMailHelper from '@helpers/send-grid.helper'
import _ from 'lodash'

export const SignUp = gql`
  extend type Mutation {
    signUp(input: SignUpInput!): SignUpMutPayload!
  }

  input SignUpInput {
    email: String!
    mobile: String!
    password: String!
  }

  type SignUpMutPayload {
    message: String!
    referenceCode: String!
    user: User!
  }
`

export const signUpResolver = {
  Mutation: {
    signUp: async (_parent, args, _context, _info) => {
      const { email, mobile, password } = args

      // Check if { Email } is available
      if (email) {
        const existingUserCount = await App.Models.User.find({
          email,
        }).countDocuments()
        if (existingUserCount) {
          throw new UserInputError('Email is not available.')
        }
      }

      // Check if { Mobile } is available
      if (mobile) {
        const existingUserCount = await App.Models.User.find({
          mobile,
        }).countDocuments()
        if (existingUserCount) {
          throw new UserInputError('Mobile is not available.')
        }
      }

      // Create User Document & Create activation code
      const user = new App.Models.User({
        email,
        mobile,
        password,
        role: Role.USER,
      })

      // Auto Generate Password
      await user['createEmailVerificationId']()
      await user.save()

      const verification2FA = _.findLast(user.verification, [
        'codeType',
        'email',
      ])

      const verifyEmailUrl = `${App.Config.GATEWAY_URL}?query={verifyEmail(email: "${email}", id: "${verification2FA.code}")}`

      // Send Email with Email Verification Url
      SgMailHelper.send({
        to: email,
        from: App.Config.SENDGRID_DEFAULT_SENDER_EMAIL,
        subject: 'Email Verification',
        text: `Verify you email by going to: ${verifyEmailUrl}`,
        html: `<a href="${verifyEmailUrl}" target="_blank"><button>Verify Email</button></a>`,
      })

      // All Done
      return {
        message: 'Registration successful. Check your email inbox to verify.',
        referenceCode: verification2FA.referenceCode,
        user,
      }
    },
  },
}
