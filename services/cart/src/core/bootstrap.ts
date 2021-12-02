import { Express } from 'express'

import { App } from '@core/globals'
import { Database } from '@core/database'

export default async (_app: Express) => {
  // Do stuff that needs to be done before server start

  // #1 Connect Database
  await connectDatabase()
}

const connectDatabase = async () => {
  const database = new Database({
    url: App.Config.DB_CONNECTION_STRING,
    connectionOptions: App.Config.DB_CONNECTION_OPTIONS,
  })
  await database.connect()
  App.Database = database
}
