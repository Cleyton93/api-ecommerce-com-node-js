import expressValidation from 'express-validation';

const { Joi, validate } = expressValidation;

export const adminGetAllValidation = validate({
  query: Joi.object({
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const adminGetByIdValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const adminRemoveValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const adminGetCartValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});

export const getAllValidation = validate({
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

export const addValidation = validate({
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
  body: Joi.object({
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
    payment: Joi.object({
      value: Joi.number().required(),
      form: Joi.string().required(),
      parceled: Joi.number().optional(),
      deliveryAddressSameAsBilling: Joi.boolean().required(),
      card: Joi.object({
        fullName: Joi.string().required(),
        areaCode: Joi.string().required(),
        phone: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        cpf: Joi.string().required(),
        credit_card_token: Joi.string().optional(),
      }).optional(),
      address: Joi.object({
        location: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string().required(),
        neighborhood: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
      }).required(),
    }).required(),
    delivery: Joi.object({
      type: Joi.string().required(),
      cost: Joi.number().required(),
      deadline: Joi.number().required(),
      address: Joi.object({
        location: Joi.string().required(),
        number: Joi.string().required(),
        complement: Joi.string().required(),
        neighborhood: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
      }).required(),
    }).required(),
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

export const getCartValidation = validate({
  params: Joi.object({
    id: Joi.string().alphanum().length(24).required(),
  }),
  query: Joi.object({
    store: Joi.string().alphanum().length(24).required(),
  }),
});
