import { Schema, model, Types } from 'mongoose';

type IBasketItem = {
  food: Types.ObjectId;
  acquired: Boolean;
};

interface IBasket {
  _id: Types.ObjectId;
  foods?: IBasketItem[];
}

const BasketSchema = new Schema<IBasket>({
  foods: [
    {
      food: {
        type: Schema.Types.ObjectId,
        ref: 'Food',
      },
      acquired: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

/* eslint-disable no-param-reassign */
BasketSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable no-param-reassign */

const BasketModel = model<IBasket>('Basket', BasketSchema);

export { IBasket, IBasketItem, BasketModel };
