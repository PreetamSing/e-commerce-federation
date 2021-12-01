import { BaseModel } from '@core/database'
import { Schema, model as Model } from 'mongoose'
const ObjectId = Schema.Types.ObjectId

interface Product extends BaseModel {
  name: string
  description?: string
  price: number
  currency?: string
}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true }, // In smallest denomination
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

export const ProductModel = Model<Product>('Product', schema)
