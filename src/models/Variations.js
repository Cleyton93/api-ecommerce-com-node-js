import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

const VariationsSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    promotion: {
      type: Number,
    },
    photos: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    delivery: {
      type: {
        dimensions: {
          type: {
            widthCm: {
              type: Number,
              required: true,
            },
            heightCm: {
              type: Number,
              required: true,
            },
            lengthCm: {
              type: Number,
              required: true,
            },
          },
          required: true,
        },
        weightKg: {
          type: Number,
          required: true,
        },
        freeShipping: {
          type: Boolean,
          default: false,
        },
      },
    },
    quantity: {
      type: Number,
      default: 0,
    },
    quantityBlock: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
      required: true,
    },
  },
  { timestamps: true },
);

mongoose.plugin(mongoosePaginate);
mongoose.plugin(uniqueValidator, { message: 'Já está sendo utilizado' });

export default mongoose.model('Variations', VariationsSchema);
