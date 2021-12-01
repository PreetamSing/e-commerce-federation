import { gql } from 'apollo-server-express'
import { UserInputError } from 'apollo-server-errors'
import bcrypt from 'bcrypt'

import { App } from '@core/globals'
import JWTHelper from '@helpers/jwt.helper'
import _ from 'lodash'
import TwilioHelper from '@helpers/twilio.helper'

export const SignIn = gql`
  extend type Mutation {
    signIn(input: SignInInput!): SignInMutPayload!
  }

  input SignInInput {
    email: String
    mobile: String
    password: String
    code: String
    grantType: GrantType!
  }

  type SignInMutPayload {
    message: String!
    referenceCode: String
    isFirstLogin: Boolean
    token: String
  }

  enum GrantType {
    PASSWORD
    twoFA
  }
`

export const signInResolver = {
  Mutation: {
    signIn: async (_parent, args, _context, _info) => {
      const { email, mobile, password, grantType, code } = args.input

      // Check at least one of { email, mobile } is provided.
      if (!email && !mobile) {
        throw new UserInputError('Provide either email or mobile.')
      }

      // Fetch user
      const query = _.pickBy({ email, mobile }, _.identity)
      const user = await App.Models.User.findOne(
        query,
        '+verification +password'
      )

      if (!user || !user.emailVerifiedAt) {
        throw new UserInputError('Invalid Credentials.')
      }

      if (grantType === 'PASSWORD') {
        if (!password || !(await bcrypt.compare(password, user.password))) {
          throw new UserInputError('Invalid password.')
        }

        // Create new twoFA code
        await user['createTwoFACode']()
        await user.save()

        const verificationTwoFA = _.findLast(user.verification, [
          'codeType',
          'twoFA',
        ])

        // Send message with verification code.
        await TwilioHelper.messages.create({
          body: `Verification code for your e-commerce login is ${verificationTwoFA.code}`,
          from: App.Config.TWILIO_DEFAULT_SENDER_MOBILE,
          to: user.mobile,
        })

        return {
          message: 'Two FA created successfully.',
          referenceCode: verificationTwoFA.referenceCode,
        }
      }

      const verificationTwoFA = _.findLast(user.verification, [
        'codeType',
        'twoFA',
      ])

      if (!code || verificationTwoFA.code !== code) {
        throw new UserInputError('Invalid code.')
      }

      // Nullify twoFA code
      const isFirstLogin = user.isFirstLogin
      user.isFirstLogin = false
      await user['deleteTwoFACode']()
      await user.save()

      // Generate a new JWT token
      const token = JWTHelper.GenerateToken({
        _id: user._id.toString(),
      })

      return {
        message: 'Login Successful.',
        isFirstLogin,
        token,
      }
    },
  },
}
