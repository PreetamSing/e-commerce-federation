import { gql } from 'apollo-server-express'
import { mergeTypeDefs } from '@graphql-tools/merge'
import _ from 'lodash'

import { Authorizer, authorizerResolver } from './authorizer'
import { SignUp, signUpResolver } from './sign-up'
import { Role } from '@core/constants/roles'

// If you had Query fields not associated with a
// specific type you could put them here
const Query = gql`
  type Query {
    ping: Success!
  }

  type User {
    _id: ID!
    email: String!
    mobile: String!
    role: Role!
    isFirstLogin: Boolean!
  }

  enum Role {
    ${Role.USER}
    ${Role.SUPER_ADMIN}
  }

  enum Success {
    SUCCESS
  }
`

const Mutation = gql`
  type Mutation {
    ping: Success!
  }
`

const resolver = {
  Query: {
    ping: (_parent, _args, _context, _info) => 'SUCCESS',
  },
  Mutation: {
    ping: (_parent, _args, _context, _info) => 'SUCCESS',
  },
}

export const typeDefs = mergeTypeDefs([Query, Mutation, Authorizer, SignUp])
export const resolvers = _.merge(resolver, authorizerResolver, signUpResolver)
