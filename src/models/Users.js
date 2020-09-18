import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET;

const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'não pode ficar vazio'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'não pode ficar vazio'],
      index: true,
      match: [/\S+@\S+\.\S+/, 'é inválido'],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
      required: true,
    },
    permissions: {
      type: Array,
      default: ['client'],
    },
    hash: String,
    salt: String,
    recovery: {
      type: {
        token: String,
        date: Date,
      },
      default: {},
    },
  },
  { timestamps: true },
);

UsersSchema.plugin(uniqueValidator, { message: 'Já está sendo utilizado' });

UsersSchema.methods.setPass = function (pass) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UsersSchema.methods.passValidator = function (pass) {
  const hash = crypto
    .pbkdf2Sync(pass, this.salt, 10000, 512, 'sha512')
    .toString('hex');

  return this.hash === hash;
};

UsersSchema.methods.generateToken = function () {
  const exp = new Date();
  exp.setDate(exp.getDate() + 15);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
      exp: parseFloat(exp.getTime() / 1000),
    },
    secret,
  );
};

UsersSchema.methods.sendAuthJSON = function () {
  return {
    name: this.name,
    email: this.email,
    store: this.store,
    permissions: this.permissions,
    token: this.generateToken(),
  };
};

UsersSchema.methods.generateTokenForPasswordRecovery = function () {
  this.recovery = {
    token: crypto.randomBytes(16).toString('hex'),
    date: moment(new Date()).add('24', 'hours').format(),
  };

  return this.recovery;
};

UsersSchema.methods.finalizeTheToken = function () {
  this.recovery = {
    token: null,
    date: null,
  };

  return this.recovery;
};

export default mongoose.model('Users', UsersSchema);
