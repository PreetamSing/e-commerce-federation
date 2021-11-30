import { Express } from 'express'

import { App } from '@core/globals'
import JWTHelper from '@helpers/jwt.helper'
import { Role } from './constants/roles'
import { Database } from '@core/database'

export default async (_app: Express) => {
  // Do stuff that needs to be done before server start

  // #1 Connect Database
  await connectDatabase()

  // #2 Check if SuperAdmin user is present, otherwise create one.
  await _createSuperAdmin()

  // #3 Generate Public and Private Keys if don't exist
  JWTHelper.GenerateKeys()
}

const connectDatabase = async () => {
  const database = new Database({
    url: App.Config.DB_CONNECTION_STRING,
    connectionOptions: App.Config.DB_CONNECTION_OPTIONS,
  })
  await database.connect()
  App.Database = database
}

const _createSuperAdmin = async () => {
  let superAdmin = await App.Models.User.findOne({
    role: Role.SUPER_ADMIN,
  })
  const superAdminJSON = {
    email: App.Config.SUPER_ADMIN_EMAIL,
    mobile: App.Config.SUPER_ADMIN_MOBILE,
    password: App.Config.SUPER_ADMIN_PASSWORD,
    role: Role.SUPER_ADMIN,
  }

  if (!superAdmin) {
    superAdmin = new App.Models.User(superAdminJSON)
    await superAdmin.save()
  } else {
    for (const key in superAdminJSON) {
      superAdmin[key] = superAdminJSON[key]
    }
    await superAdmin.save()
  }
}
