import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const getAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const searchValidation = validate({
  params: Joi.object({
    search: Joi.string().required(),
  }),
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const getClientByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const updateAdminValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().optional(),
    cpf: Joi.string()
      .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/))
      .optional(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      location: Joi.string().required(),
      number: Joi.number().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    }).optional(),
    phones: Joi.array().items(Joi.string().required()).optional(),
    dateOfBirth: Joi.date().optional(),
    pass: Joi.string().optional(),
  }),
});

export const getClientValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const addValidation = validate({
  body: Joi.object({
    name: Joi.string().required(),
    cpf: Joi.string()
      .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/))
      .required(),
    email: Joi.string().email().required(),
    address: Joi.object({
      location: Joi.string().required(),
      number: Joi.number().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    }).required(),
    phones: Joi.array().items(Joi.string().required()).required(),
    dateOfBirth: Joi.date().required(),
    pass: Joi.string().required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const updateValidation = validate({
  body: Joi.object({
    name: Joi.string().optional(),
    cpf: Joi.string()
      .pattern(new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/))
      .optional(),
    email: Joi.string().email().optional(),
    address: Joi.object({
      location: Joi.string().required(),
      number: Joi.number().required(),
      complement: Joi.string().optional(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string()
        .pattern(new RegExp(/^\d{5}-\d{3}$/))
        .required(),
    }).optional(),
    phones: Joi.array().items(Joi.string().required()).optional(),
    dateOfBirth: Joi.date().optional(),
    pass: Joi.string().optional(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const removeValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});
