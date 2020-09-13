import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const StoresSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    phones: {
      type: [
        {
          type: String,
        },
      ],
    },
    address: {
      type: {
        location: {
          type: String,
        },
        number: {
          type: String,
          required: true,
        },
        complement: {
          type: String,
        },
        neighborhood: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        zipcode: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
  },
  { timestamps: true },
);

StoresSchema.plugin(uniqueValidator, { message: 'Jaá está sendo utilizado.' });

export default mongoose.model('Stores', StoresSchema);
