import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const getAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const getAllAvailablesValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const getByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
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

export const addValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    name: Joi.string().min(4).required(),
    code: Joi.string().min(4).required(),
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
    name: Joi.string().min(4).optional(),
    code: Joi.string().min(4).optional(),
    availability: Joi.boolean().optional(),
    products: Joi.array()
      .items(Joi.string().alphanum().length(24).optional())
      .optional(),
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

export const showProductsValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const updateListProductsValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    productsList: Joi.array()
      .items(Joi.string().alphanum().length(24).required())
      .required(),
  }),
});
