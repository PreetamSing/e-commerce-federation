// config.ts
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
import { buildSubgraphSchema } from '@apollo/subgraph'

import { typeDefs, resolvers } from '@schemas/index'
import Bootstrap from '@core/bootstrap'
import { App, Logger } from '@core/globals'

async function startApolloServer() {
  const app = express()
  await Bootstrap(app)
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs,
        resolvers,
      },
    ]),
    context: ({ req, res: _res }) => {
      return { req, user: req?.body?.user }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: App.Config.PORT }, resolve)
  )
  Logger.info(
    `🚀 Server ready at http://localhost:${App.Config.PORT}${server.graphqlPath}`
  )
}

startApolloServer().catch((error) => {
  Logger.error('Failed to start server', error)
})
