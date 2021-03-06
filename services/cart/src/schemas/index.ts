import { gql } from 'apollo-server-express'
import { mergeTypeDefs } from '@graphql-tools/merge'
import _ from 'lodash'

import { Role } from '@core/constants/roles'
import { CreateProduct, createProductResolver } from './create-product'
import { GetProducts, getProductsResolver } from './get-products'
import { BuyProduct, buyProductResolver } from './buy-product'
import { UpdatePurchase, updatePurchaseResolver } from './update-purchase'
import { customScalarResolvers } from 'custom-scalars'

// If you had Query fields not associated with a
// specific type you could put them here
const Query = gql`
  type Query {
    pingCart: String!
  }

  scalar Date

  type Product {
    _id: ID!
    name: String!
    description: String
    price: Int!
    currency: String!
    isActive: Boolean!
    _createdBy: ID
    _updatedBy: ID
    createdAt: Date
    updatedAt: Date
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
    pingCart: String!
  }
`

const resolver = {
  Query: {
    pingCart: (_parent, _args, _context, _info) => 'SUCCESS',
  },
  Mutation: {
    pingCart: (_parent, _args, _context, _info) => 'SUCCESS',
  },
}

export const typeDefs = mergeTypeDefs([
  Query,
  Mutation,
  CreateProduct,
  GetProducts,
  BuyProduct,
  UpdatePurchase,
])
export const resolvers = _.merge(
  resolver,
  customScalarResolvers,
  createProductResolver,
  getProductsResolver,
  buyProductResolver,
  updatePurchaseResolver
)
