import expressValidation from 'express-validation';

import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

import calculateShipping from '../integrations/correios.js';

const { Joi, validate } = expressValidation;

export const getByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const updateValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    status: Joi.string().optional(),
    trackingCode: Joi.string().optional(),
  }),
});

export const calculateValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    cep: Joi.string().required(),
    cart: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().alphanum().length(24).required(),
          variation: Joi.string().alphanum().length(24).required(),
          quantity: Joi.number().required(),
          unitPrice: Joi.number().required(),
        }).required(),
      )
      .required(),
  }),
});

const checkDeliveryValue = async (cep, cart, delivery) => {
  try {
    const cartData = await Promise.all(
      cart.map(async (item) => {
        item.product = await Products.findById(item.product);
        item.variation = await Variations.findById(item.variation);

        return item;
      }),
    );

    const results = await calculateShipping({ cep, products: cartData });

    let found = false;

    results.forEach((result) => {
      if (
        result.Codigo.toString() === delivery.type.toString() &&
        Number(result.Valor.replace(/,/g, '.')) === Number(delivery.cost) &&
        result.PrazoEntrega.toString() === delivery.deadline.toString()
      )
        found = true;
    });

    return found;
  } catch (e) {
    return false;
  }
};

export default checkDeliveryValue;
