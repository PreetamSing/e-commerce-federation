import { gql } from 'apollo-server-express'
import { mergeTypeDefs } from '@graphql-tools/merge'
import _ from 'lodash'
import { Authorizer, authorizerResolver } from './authorizer'

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
    USER
    SUPER_ADMIN
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

export const typeDefs = mergeTypeDefs([Query, Mutation, Authorizer])
export const resolvers = _.merge(resolver, authorizerResolver)
