// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

// Load Path Alias For Transpiled Code [Sync]
import path from 'path'
if (path.extname(__filename) === '.js') {
  require('module-alias/register')
}

import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import proxy from 'express-http-proxy'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'

import Context from './context'

async function startApolloServer() {
  const app = express()

  // Setup proxy for rest-api.
  const REST_API_URL = process.env.REST_API_URL
  app.use('/rest', proxy(REST_API_URL))
  const httpServer = http.createServer(app)
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
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  )
  console.log(`🚀 Server ready at http://localhost:4000`)
}

startApolloServer().catch((error) => {
  console.error('Failed to start server', error)
})
