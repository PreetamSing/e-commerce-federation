import '@core/declarations'
import { Logger } from '@core/globals'
import { FileExistsSync } from './utils'

export interface ConfigInterface {
  PORT: number
  ENVIRONMENT: string
  DB_CONNECTION_STRING: string
  DB_CONNECTION_OPTIONS: any

  GATEWAY_URL: string
  REST_API_ADDRESS: string
  ITEMS_PER_PAGE: number

  STRIPE_PUBLISHABLE_KEY: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

export default (): ConfigInterface => {
  const { NODE_ENV = 'development' } = process.env
  const environment = NODE_ENV?.toLowerCase()
  const environmentFileLocation = `${__dirname}/../environments`
  const environmentFilePath = `${environmentFileLocation}/${environment}`
  if (FileExistsSync(environmentFilePath)) {
    /* eslint-disable */
    // prettier-ignore
    const configuration: ConfigInterface = (require(environmentFilePath).default)()
    /* eslint-enable */
    return configuration
  } else {
    Logger.error(`Missing environment file for NODE_ENV=${environment}.`)
    throw Error(`Missing environment file for NODE_ENV=${environment}.`)
  }
}
