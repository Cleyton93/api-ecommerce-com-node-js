import express from 'express';

import ClientsController from '../controllers/ClientsController.js';

import auth from '../config/auth.js';

import * as validate from '../validations/clients-validation.js';
import storeAdminValidation from '../validations/stores-validation.js';

const router = express.Router();
const clientsController = new ClientsController();

// ADMIN
router.get(
  '/',
  auth.required,
  storeAdminValidation,
  validate.getAllValidation,
  clientsController.getAll,
); // testado

// router.get(
//   '/search/:search/pedidos',
//   auth.required,
//   storeAdminValidation,
//   clientsController.searchRequests,
// );

router.get(
  '/search/:search',
  auth.required,
  storeAdminValidation,
  validate.searchValidation,
  clientsController.search,
); // testado

// router.get(
//   '/admin/:id/pedidos',
//   auth.required,
//   storeAdminValidation,
//   clientsController.showClientRequests,
// );

router.get(
  '/admin/:id',
  auth.required,
  storeAdminValidation,
  validate.getClientByIdValidation,
  clientsController.getClientById,
); // testado

router.put(
  '/admin/:id',
  auth.required,
  storeAdminValidation,
  validate.updateAdminValidation,
  clientsController.updateAdmin,
); // testado

// CLIENT
router.get(
  '/show',
  auth.required,
  validate.getClientValidation,
  clientsController.getClient, // testado
);

router.post('/', validate.addValidation, clientsController.add); // testado

router.put(
  '/',
  auth.required,
  validate.updateValidation,
  clientsController.update,
); // testado

router.delete(
  '/',
  auth.required,
  validate.removeValidation,
  clientsController.remove,
); // testado

export default router;
