import { Response } from 'express'

export default function (data = {}): Response {
  const statusCode = 200
  const {
    message = 'Success.',
    referenceCode,
    isFirstLogin,
    token,
    item = null,
    items = null,

    // Pagination Related Fields
    totalItems,
    startIndex,
    itemsPerPage,
  }: {
    message?: string
    referenceCode?: string
    isFirstLogin?: string
    token?: string
    item?: any
    items?: [any]

    // Pagination Related Fields
    totalItems?: number
    startIndex?: number
    itemsPerPage?: number
  } = data

  const resultant = {
    data: {
      message,
      referenceCode,
      isFirstLogin,
      token,
      statusCode,

      // Pagination Related Fields
      totalItems,
      startIndex,
      itemsPerPage,

      items: items ? items : item ? [item] : undefined,
    },
  }

  // All Done
  return this.status(statusCode).json(resultant)
}
