import express from 'express';

import RequestsController from '../controllers/RequestsController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
// import * as validate from '../validations/requests-validation.js';

const router = express.Router();
const requestsController = new RequestsController();

// ADMIN
// router.get(
//   '/admin',
//   auth.required,
//   storeAdminValidation,
//   validate.adminGetAllValidation,
//   requestsController.adminGetAll,
// );

// router.get(
//   '/admin/:id',
//   auth.required,
//   storeAdminValidation,
//   validate.adminGetByIdValidation,
//   requestsController.adminGetById,
// );

// router.delete(
//   '/admin/:id',
//   auth.required,
//   storeAdminValidation,
//   validate.adminRemoveValidation,
//   requestsController.adminRemove,
// );

// router.get(
//   '/admin/:id/carrinho',
//   auth.required,
//   storeAdminValidation,
//   validate.adminGetCartValidation,
//   requestsController.adminGetCart,
// );

// CLIENTS
// router.get(
//   '/',
//   auth.required,
//   validate.getAllValidation,
//   requestsController.getAll,
// );

// router.get(
//   '/:id',
//   auth.required,
//   validate.getByIdValidation,
//   requestsController.getById,
// );

router.post('/', auth.required, requestsController.add);

// router.delete(
//   '/:id',
//   auth.required,
//   validate.removeValidation,
//   requestsController.remove,
// );

// router.get(
//   ':id/carrinho',
//   auth.required,
//   validate.getCartValidation,
//   requestsController.getCart,
// );

export default router;
