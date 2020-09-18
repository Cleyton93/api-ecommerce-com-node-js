import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const addValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().alphanum().length(24).required(),
    price: Joi.number().required(),
    promotion: Joi.number().optional(),
    sku: Joi.string().required(),
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
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().alphanum().length(24).optional(),
    price: Joi.number().optional(),
    promotion: Joi.number().optional(),
    sku: Joi.string().optional(),
    availability: Joi.boolean().optional(),
  }),
});

export const uploadImagesValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
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

export const removeImageValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
    image: Joi.string().required(),
  }),
});

export const getAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
    order: Joi.string().optional(),
  }),
});

export const getAllAvailablesValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
    order: Joi.string().optional(),
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
    order: Joi.string().optional(),
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

export const getVariationsValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
});

export const getRatingsValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    offset: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).optional(),
  }),
});
