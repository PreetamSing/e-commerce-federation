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

    ITEMS_PER_PAGE: parseInt(process.env.ITEMS_PER_PAGE),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    SUPER_ADMIN_MOBILE: process.env.SUPER_ADMIN_MOBILE,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_DEFAULT_SENDER_EMAIL: process.env.SENDGRID_DEFAULT_SENDER_EMAIL,
  }
}
