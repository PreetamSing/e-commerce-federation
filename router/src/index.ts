// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Load Path Alias For Transpiled Code [Sync]
import path from 'path'
if (path.extname(__filename) === '.js') {
  require('module-alias/register')
}

import { ApolloServer } from 'apollo-server'
import { ApolloGateway } from '@apollo/gateway'

const gateway = new ApolloGateway()

const server = new ApolloServer({
  gateway,
})

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`)
  })
  .catch((err) => {
    console.error(err)
  })
