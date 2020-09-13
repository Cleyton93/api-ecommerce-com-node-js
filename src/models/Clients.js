import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const ClientsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'Não pode ficar vazio.'],
    },
    name: {
      type: String,
      required: [true, 'Não pode ficar vazio.'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Não pode ficar vazio.'],
    },
    cpf: {
      type: String,
      match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'É inválido'],
      required: [true, 'Não pode ficar vazio.'],
    },
    phones: {
      type: [
        {
          type: String,
        },
      ],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
      required: [true, 'Não pode ficar vazio.'],
    },
    address: {
      type: {
        location: {
          type: String,
          required: [true, 'Não pode ficar vazio.'],
        },
        number: {
          type: String,
          required: [true, 'Não pode ficar vazio.'],
        },
        complement: {
          type: String,
        },
        neighborhood: {
          type: String,
          required: [true, 'Não pode ficar vazio.'],
        },
        city: {
          type: String,
          required: [true, 'Não pode ficar vazio.'],
        },
        state: {
          type: String,
          required: [true, 'Não pode ficar vazio.'],
        },
        zipcode: {
          type: String,
          match: [/^\d{5}-\d{3}$/, 'É inválido'],
          required: [true, 'Não pode ficar vazio.'],
        },
      },
      required: [true, 'Não pode ficar vazio.'],
    },
  },
  { timestamps: true },
);

ClientsSchema.plugin(mongoosePaginate);

export default mongoose.model('Clients', ClientsSchema);
