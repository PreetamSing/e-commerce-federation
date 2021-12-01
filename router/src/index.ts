// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Load Path Alias For Transpiled Code [Sync]
import path from 'path'
if (path.extname(__filename) === '.js') {
  require('module-alias/register')
}

import { ApolloServer } from 'apollo-server'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'

import Context from './context'

const gateway = new ApolloGateway({
  buildService: ({ name, url }) => {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        // Following user will appear in the 'req.body.user' of service
        // @ts-ignore
        request.user = context.user
      },
    })
  },
})

const server = new ApolloServer({
  gateway,
  context: Context,
})

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`)
  })
  .catch((err) => {
    console.error(err)
  })
