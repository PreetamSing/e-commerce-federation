import { Response } from 'express'

export default function (data = {}): Response {
  const statusCode = 422
  const {
    message = 'Invalid Mongo Id.',
    error = null,
    errors = null,
  }: {
    message?: string
    error?: any
    errors?: [any]
  } = data

  const resultant = {
    error: {
      message,
      statusCode,
      errors: errors ? errors : error ? [error] : undefined,
    },
  }

  // All Done
  return this.status(statusCode).json(resultant)
}