import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const RatingsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
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
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clients',
      required: true,
    },
  },
  { timestamps: true },
);

RatingsSchema.plugin(mongoosePaginate);

export default mongoose.model('Ratings', RatingsSchema);
