import { BaseModel } from '@core/database'
import { Schema, model as Model } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

interface Purchase extends BaseModel {
  _user: typeof ObjectId
  _product: typeof ObjectId
  paymentIntentId: string
  isAmountReceived: boolean
  amount: number
  currency?: string
}

const schema = new Schema<Purchase>(
  {
    _user: { type: ObjectId, required: true, ref: 'User' },
    _product: { type: ObjectId, required: true, ref: 'Product' },
    paymentIntentId: { type: String, required: true },
    isAmountReceived: { type: Boolean, default: false },
    currency: { type: String, default: 'inr' },

    // From Base Model.
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

export const PurchaseModel = Model<Purchase>('Purchase', schema)
