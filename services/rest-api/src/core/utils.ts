import '@core/declarations'
import { Request, Response, NextFunction } from 'express'
import * as fs from 'fs'
import { EndPoints } from '@core/constants/endpoint-values'

export const FileExistsSync = (FilePath) => {
  return fs.existsSync(`${FilePath}.js`) || fs.existsSync(`${FilePath}.ts`)
}

export function GenerateRandomStringOfLength(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function GenerateRandomNumberOfLength(length) {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function Wrap(controller: CallableFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next)
    } catch (error) {
      Logger.error(error)
      return res.internalServerError({ error })
    }
  }
}

/**
 * Filtering out all the Real AclProtect values
 */
export const GetAclValues = (): number[] => {
  const readAclValues = []
  for (const property in EndPoints) {
    const element = EndPoints[property]
    readAclValues.push(...Object.values(element))
  }
  return readAclValues
}

export const PermissionsToReadable = async (permissions: [number]) => {
  permissions = permissions || [null]
  const permissionKeys = Object.keys(EndPoints)
  const permissionsMeta = {}
  for (let i = 0; i < permissionKeys.length; i++) {
    const key = permissionKeys[i]
    const element = EndPoints[key]
    const subKeys = Object.keys(element)
    permissionsMeta[key] = {}
    for (let j = 0; j < subKeys.length; j++) {
      const subKey = subKeys[j]
      if (element[subKey] && permissions.includes(element[subKey])) {
        permissionsMeta[key][subKey] = true
      } else {
        permissionsMeta[key][subKey] = false
      }
    }
  }
  return permissionsMeta
}

export const ReadableToPermissions = async (readablePermissions: any) => {
  readablePermissions = readablePermissions || null
  const readablePermissionsKeys = Object.keys(readablePermissions)
  const permissions = []

  for (let i = 0; i < readablePermissionsKeys.length; i++) {
    const key = readablePermissionsKeys[i]
    const readableElement = readablePermissions[key]
    const permissionElement = EndPoints[key]

    if (readableElement && permissionElement) {
      const subKeys = Object.keys(readableElement)
      for (let j = 0; j < subKeys.length; j++) {
        const subKey = subKeys[j]
        if (readableElement[subKey] === true && permissionElement?.[subKey]) {
          permissions.push(permissionElement[subKey])
        }
      }
    }
  }
  return permissions.filter((e) => e != undefined)
}

export const BasicAuthCredentialFetch = (options: any) => {
  const authorization = options.authorization
  if (!authorization || authorization.indexOf('Basic ') === -1) {
    return null
  }

  // verify auth credentials
  const base64Credentials = authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [username, password] = credentials.split(':')
  return {
    username,
    password,
  }
}
