import { ConfigInterface } from '@config'

export default (): ConfigInterface => {
  return {
    PORT: parseInt(process.env.PROD_PORT),
    ENVIRONMENT: 'production',
    DB_CONNECTION_STRING: process.env.PROD_DB_CONNECTION_STRING,
    DB_CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },

    GATEWAY_URL: process.env.GATEWAY_URL,
    REST_API_ADDRESS: process.env.REST_API_ADDRESS,
    ITEMS_PER_PAGE: parseInt(process.env.ITEMS_PER_PAGE),
    STRIPE_PUBLISHABLE_KEY: process.env.PROD_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.PROD_STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }
}
