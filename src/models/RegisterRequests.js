import mongoose from 'mongoose';

const RegisterRequestsSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Requests',
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    payload: {
      type: Object,
    },
  },
  { timestamps: true },
);

export default mongoose.model('RegisterRequests', RegisterRequestsSchema);
