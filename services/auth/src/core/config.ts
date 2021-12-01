import '@core/declarations'
import { Logger } from '@core/globals'
import { FileExistsSync } from './utils'

export interface ConfigInterface {
  PORT: number
  ENVIRONMENT: string
  DB_CONNECTION_STRING: string
  DB_CONNECTION_OPTIONS: any

  GATEWAY_URL: string
  ITEMS_PER_PAGE: number

  SALT_ROUNDS: number
  JWT_SECRET: string
  JWT_EXPIRY: string
  SUPER_ADMIN_EMAIL: string
  SUPER_ADMIN_PASSWORD: string
  SUPER_ADMIN_MOBILE: string
  SENDGRID_API_KEY: string
  SENDGRID_DEFAULT_SENDER_EMAIL: string
  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
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
