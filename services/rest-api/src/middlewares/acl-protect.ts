import { Role } from '@core/constants/roles'
import '@core/declarations'
import { Request, Response, NextFunction } from 'express'

export const aclProtect = (...permissions: number[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user: __user } = req

      // Skip if the the account is Super User Account
      if (__user.accountTypeCode === Role.SUPER_ADMIN) {
        return next()
      }

      const found = __user.permissions.some((r) => permissions.includes(r))
      if (!found) {
        return res.forbidden({
          error: 'You are not allowed to perform this action.',
        })
      }
      return next()
    } catch (error) {
      Logger.error(error)
      return res.internalServerError({ error })
    }
  }
}
