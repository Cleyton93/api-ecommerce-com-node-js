import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const getAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
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
    code: Joi.string().alphanum().min(4).required(),
    name: Joi.string().min(4).required(),
    price: Joi.number().required(),
    promotion: Joi.number().optional(),
    delivery: Joi.object({
      dimensions: Joi.object({
        widthCm: Joi.number().required(),
        heightCm: Joi.number().required(),
        lengthCm: Joi.number().required(),
      }).required(),
      weightKg: Joi.number().required(),
      freeShipping: Joi.boolean().optional(),
    }).required(),
    quantity: Joi.number().optional(),
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
    code: Joi.string().alphanum().min(4).optional(),
    name: Joi.string().min(4).optional(),
    price: Joi.number().optional(),
    promotion: Joi.number().optional(),
    delivery: Joi.object({
      dimensions: Joi.object({
        widthCm: Joi.number().required(),
        heightCm: Joi.number().required(),
        lengthCm: Joi.number().required(),
      }).required(),
      weightKg: Joi.number().required(),
      freeShipping: Joi.boolean().optional(),
    }).optional(),
    quantity: Joi.number().optional(),
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
