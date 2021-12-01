import { ConfigInterface } from '@config'

export default (): ConfigInterface => {
  return {
    PORT: parseInt(process.env.DEV_PORT),
    ENVIRONMENT: 'development',
    DB_CONNECTION_STRING: process.env.DEV_DB_CONNECTION_STRING,
    DB_CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },

    GATEWAY_URL: process.env.GATEWAY_URL,
    ITEMS_PER_PAGE: parseInt(process.env.ITEMS_PER_PAGE),
    STRIPE_PUBLISHABLE_KEY: process.env.DEV_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.DEV_STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }
}
