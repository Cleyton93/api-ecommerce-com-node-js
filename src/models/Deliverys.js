import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const DeliverysSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    trackingCode: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Number,
      required: true,
    },
    address: {
      type: {
        location: {
          type: String,
          required: true,
        },
        number: {
          type: Number,
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
        state: {
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
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requests',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
      required: true,
    },
    payload: {
      type: Object,
    },
  },
  { timestamps: true },
);

DeliverysSchema.plugin(mongoosePaginate);

export default mongoose.model('Deliverys', DeliverysSchema);
