import '@core/declarations'
import express, { Request, Response, NextFunction } from 'express'
import '@core/globals'
import { Global } from '@core/globals'
import cors from 'cors'
import helmet from 'helmet'
import morganLogger from 'morgan'
import { _registerResponders } from '@core/response-handler'
import { Database } from '@core/database'
import { AppRoutes } from './app.routes'

export class Application {
  private app: express.Application

  constructor() {
    this.app = express()
    Global.App.Http.app = this.app
    this.middleware()
    this.config()
    this.connectDatabase()
    this.registerResponders()
    this.registerRoutes()
  }

  // Returns Express App
  express(): express.Application {
    return this.app
  }

  // Configuration and Setup
  private config(): void {
    this.app.set('port', App.Config.PORT || 9000)
    this.app.set('env', App.Config.ENVIRONMENT || 'development')
    this.app.disable('x-powered-by')
  }

  // Http(s) request middleware
  private middleware(): void {
    if (App.Config.ENVIRONMENT !== 'test') {
      this.app.use(morganLogger('dev'))
    }
    this.app.use(cors())
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  // Register Responders Dynamically
  private async registerResponders(): Promise<void> {
    this.app.use(
      async (_request: Request, response: Response, next: NextFunction) => {
        await _registerResponders(response)
        next()
      }
    )
  }

  // Register Routes
  private async registerRoutes(): Promise<void> {
    this.app.use('/api/v1', AppRoutes)

    this.app.get('/', (_req: Request, res: Response) => {
      return res.success({ message: 'Welcome' })
    })

    // Handle the 404 errors
    this.app.use((_req: Request, res: Response) => {
      return res.notFound()
    })
  }

  // Connect Database
  private async connectDatabase(): Promise<void> {
    const database = new Database({
      url: App.Config.DB_CONNECTION_STRING,
      connectionOptions: App.Config.DB_CONNECTION_OPTIONS,
    })
    await database.connect()
    Global.App.Database = database
  }

  // Do things after the server starts
  async onServerStart(): Promise<any> {
    Logger.info(
      `App is running at http://localhost:${App.Config.PORT} in ${App.Config.ENVIRONMENT} mode.`
    )
    Logger.info('Press CTRL-C to stop')
  }
}

export default new Application()
