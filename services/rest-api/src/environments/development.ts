import { ConfigInterface } from '@config'

export default (): ConfigInterface => {
  return {
    PORT: parseInt(process.env.DEV_PORT),
    ENVIRONMENT: 'development',
    DB_CONNECTION_STRING: process.env.DEV_DB_CONNECTION_STRING,
    DB_CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      createIndexes: true,
    },

    ITEMS_PER_PAGE: parseInt(process.env.ITEMS_PER_PAGE),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    CART_URL: process.env.CART_URL,
    STRIPE_PUBLISHABLE_KEY: process.env.DEV_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.DEV_STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SERVICE_PRIVATE_KEY: process.env.SERVICE_PRIVATE_KEY,
  }
}
