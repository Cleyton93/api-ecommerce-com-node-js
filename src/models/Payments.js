import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const PaymentsSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    form: {
      type: String,
      required: true,
    },
    status: {
      type: String,
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
    card: {
      type: {
        fullName: {
          type: String,
          required: true,
        },
        areaCode: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        dateOfBirth: {
          type: String,
          required: true,
        },
        cpf: {
          type: String,
          required: true,
        },
        credit_card_token: {
          type: String,
        },
      },
    },
    deliveryAddressSameAsBilling: {
      type: Boolean,
      default: true,
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
      type: Array,
    },
    pagSeguroCode: {
      type: String,
    },
  },
  { timestamps: true },
);

PaymentsSchema.plugin(mongoosePaginate);

export default mongoose.model('Payments', PaymentsSchema);
