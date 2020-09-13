import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const showValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const registerValidation = validate({
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    pass: Joi.string().required(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const updateValidation = validate({
  body: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    pass: Joi.string().optional(),
  }),
});

export const loginValidation = validate({
  body: Joi.object({
    email: Joi.string().email().required(),
    pass: Joi.string().required(),
  }),
});
