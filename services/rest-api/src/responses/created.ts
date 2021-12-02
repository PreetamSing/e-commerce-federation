import { Response } from 'express'

export default function (data = {}): Response {
  const statusCode = 201
  const {
    message = 'Created.',
    referenceCode,
    item = null,
    items = null,
  }: {
    message?: string
    referenceCode?: string
    item?: any
    items?: [any]
  } = data

  const resultant = {
    data: {
      message,
      statusCode,
      referenceCode,
      items: items ? items : item ? [item] : undefined,
    },
  }

  // All Done
  return this.status(statusCode).json(resultant)
}
