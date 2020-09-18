import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

const CategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Products',
        },
      ],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
    },
  },
  { timestamps: true },
);

CategoriesSchema.plugin(mongoosePaginate);
CategoriesSchema.plugin(uniqueValidator, {
  message: 'Já está sendo utilizado.',
});

export default mongoose.model('Categories', CategoriesSchema);
