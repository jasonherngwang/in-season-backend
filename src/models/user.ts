import { Schema, model, Types } from 'mongoose';
import { MonthsInSeason } from '../types';

// Interfaces
interface IFood {
  _id: Types.ObjectId;
  name: string;
  category: string;
  months: MonthsInSeason;
  description?: string;
  imageUrl?: string;
}

interface IBasketFood {
  _id: Types.ObjectId;
  food: IFood;
  acquired: boolean;
}

interface IUser {
  _id: Types.ObjectId;
  username: string;
  passwordHash: string;
  foods?: IFood[];
  basket: IBasketFood[];
}

// Schemas
// Mongoose auto-created _id for subdocuments
const FoodSchema = new Schema<IFood>({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  months: {
    type: Schema.Types.Mixed,
    required: true,
  },
  description: String,
  imageUrl: String,
});

// Basket items can be marked as acquired during a shopping trip
const BasketFood = new Schema<IBasketFood>({
  food: FoodSchema,
  acquired: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// All subdocuments are embedded inside the top-level User document
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minLength: 1,
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: 1,
  },
  foods: [FoodSchema],
  basket: [BasketFood],
});

/* eslint-disable no-param-reassign */
FoodSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
/* eslint-enable no-param-reassign */

const UserModel = model('User', UserSchema);

// eslint-disable-next-line object-curly-newline
export { IFood, IBasketFood, IUser, UserModel };
