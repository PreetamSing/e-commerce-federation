import { App } from '@core/globals'
import { BaseModel } from '@core/database'
import { Schema, model as Model } from 'mongoose'
import bcrypt from 'bcrypt'
import {
  GenerateRandomStringOfLength,
  GenerateRandomNumberOfLength,
} from '@core/utils'
import { Role } from '@core/constants/roles'
const ObjectId = Schema.Types.ObjectId

interface User extends BaseModel {
  email: string
  emailVerifiedAt?: Date
  mobile: string
  mobileVerifiedAt?: Date
  password: string

  verification?: {
    codeType: string
    referenceCode: string
    code: string
  }[]
  role: string
  isFirstLogin?: boolean
}

const schema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, sparse: true },
    emailVerifiedAt: Date,
    mobile: { type: String, required: true, unique: true, sparse: true },
    mobileVerifiedAt: Date,
    password: { type: String, select: false },

    role: { type: String, default: Role.USER },
    verification: {
      type: [
        {
          codeType: {
            type: String,
            enum: [
              'forgotPassword',
              'resetPassword',
              'email',
              'mobile',
              '2FA',
              null,
            ],
          },
          referenceCode: String,
          code: String,
        },
      ],
      _id: false,
      select: false,
    },
    isFirstLogin: { type: Boolean, default: true },

    // From Base Model
    isActive: { type: Boolean, default: true },
    _createdBy: { type: ObjectId, ref: 'User', select: false },
    _updatedBy: { type: ObjectId, ref: 'User', select: false },
  },
  {
    autoIndex: true,
    versionKey: false,
    timestamps: true,
  }
)

// Before Save Hook
schema.pre('save', async function (next) {
  // Hash password
  const { password } = this
  if (this.isModified('password')) {
    const hash = bcrypt.hashSync(password, App.Config.SALT_ROUNDS)
    this.password = hash
  }

  next()
})

/**
 * *************************************************
 *        I N S T A N C E   M E T H O D S
 * *************************************************
 */
// Create Validation Codes
schema.method(
  'createVerificationCode',
  async function (codeType: string): Promise<void> {
    await this.verification.push({
      codeType: codeType,
      code: GenerateRandomNumberOfLength(4),
      referenceCode: GenerateRandomStringOfLength(10),
    })
  }
)

// Nullify verification
schema.method(
  'deleteVerificationCode',
  async function (codeType: string): Promise<void> {
    await this.verification.pull({ 'verification.codeType': codeType })
    await this.save()
  }
)

// Create 2FA code
schema.method('create2FACode', async function (): Promise<void> {
  await this.delete2FACode()
  await this.createVerificationCode('2FA')
})

// Nullify 2FA code
schema.method('delete2FACode', async function (): Promise<void> {
  await this.deleteVerificationCode('2FA')
})

// Create Reset Password code
schema.method('createResetPasswordCode', async function (): Promise<void> {
  await this.deleteResetPasswordCode()
  await this.createVerificationCode('resetPassword')
})

// Nullify Reset Password code
schema.method('deleteResetPasswordCode', async function (): Promise<void> {
  await this.deleteVerificationCode('resetPassword')
})

// Create Forgot Password code
schema.method('createForgotPasswordCode', async function (): Promise<void> {
  await this.deleteResetPasswordCode()
  await this.createVerificationCode('forgotPassword')
})

// Nullify Forgot Password code
schema.method('deleteForgotPasswordCode', async function (): Promise<void> {
  await this.deleteVerificationCode('forgotPassword')
})

// All Done
export const UserModel = Model<User>('User', schema)
