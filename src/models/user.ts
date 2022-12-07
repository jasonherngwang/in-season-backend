import { Schema, model } from 'mongoose';

interface IUser {
  username: string;
  name: string;
  passwordHash: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  name: String,
  passwordHash: String,
  // foods: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Food',
  //   },
  // ],
});

/* eslint-disable no-underscore-dangle, no-param-reassign */
UserSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
/* eslint-enable no-underscore-dangle, no-param-reassign */

const UserModel = model<IUser>('User', UserSchema);

export { IUser, UserModel };
