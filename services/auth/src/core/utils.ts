import '@core/declarations'
import * as fs from 'fs'

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
