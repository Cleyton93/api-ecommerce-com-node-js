import expressValidation from 'express-validation';

import Users from '../models/Users.js';

const { Joi, validate } = expressValidation;

export default async (req, res, next) => {
  const { store } = req.query;
  const { id } = req.payload;

  if (!id) return res.sendStatus(401);
  if (!store) return res.sendStatus(401);

  try {
    const user = await Users.findById(id);

    if (!user) res.sendStatus(401);
    if (!user.store) res.sendStatus(401);
    if (!user.permissions.includes('admin')) return res.sendStatus(401);
    if (String(user.store) !== store) return res.sendStatus(401);

    return next();
  } catch (err) {
    return next(err);
  }
};

export const getByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const addValidation = validate({
  body: Joi.object({
    name: Joi.string().required(),
    cnpj: Joi.string()
      .pattern(new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/))
      .required(),
    email: Joi.string().email().required(),
    phones: Joi.array().items(Joi.string().required()).required(),
    address: Joi.object({
      location: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      zipcode: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    }).required(),
  }),
});

export const updateValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().optional(),
    cnpj: Joi.string()
      .pattern(new RegExp(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/))
      .optional(),
    email: Joi.string().email().optional(),
    phones: Joi.array().items(Joi.string().required()).optional(),
    address: Joi.object({
      location: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      zipcode: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    }).optional(),
  }),
});

export const removeValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});
