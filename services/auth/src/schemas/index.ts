import _ from 'lodash'
import { gql } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'

// If you had Query fields not associated with a
// specific type you could put them here
const Query = gql`
  type Query {
    _empty: String
  }
`

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`

const resolvers = {}

export default makeExecutableSchema({
  typeDefs: [Query, Mutation /* , Other imported typeDefs */],
  resolvers: _.merge(resolvers /* , otherResolvers */),
})
