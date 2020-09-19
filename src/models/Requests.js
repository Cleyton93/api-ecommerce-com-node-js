import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const RequestsSchema = new mongoose.Schema(
  {
    canceled: {
      type: Boolean,
      default: false,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clients',
      required: true,
    },
    cart: {
      type: [
        {
          type: {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Products',
              required: true,
            },
            variations: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Variations',
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
          },
          required: true,
        },
      ],
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payments',
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deliverys',
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

RequestsSchema.plugin(mongoosePaginate);

export default mongoose.model('Requests', RequestsSchema);
