import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import uniqueValidator from 'mongoose-unique-validator';

const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: Array,
      deafult: [],
    },
    price: {
      type: Number,
      required: true,
    },
    promotion: {
      type: Number,
    },
    sku: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
    },
    ratings: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ratings',
        },
      ],
    },
    variations: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Variations',
        },
      ],
    },
  },
  { timestamps: true },
);

mongoose.plugin(mongoosePaginate);
mongoose.plugin(uniqueValidator, { message: 'Já está sendo utilizado' });

export default mongoose.model('Products', ProductsSchema);
