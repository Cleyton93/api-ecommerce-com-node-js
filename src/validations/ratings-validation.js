import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const getAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).optional(),
    product: Joi.string().alphanum().length(24).required(),
  }),
});

export const getByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const addValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
    product: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
    text: Joi.string().required(),
    points: Joi.number().min(1).max(5).required(),
  }),
});

export const removeValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});
