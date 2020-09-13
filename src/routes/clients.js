import express from 'express';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';

import {
  getAllValidation,
  searchValidation,
  getClientByIdValidation,
  updateAdminValidation,
  getClientValidation,
  addValidation,
  updateValidation,
  removeValidation,
} from '../validations/clients-validation.js';

import ClientsController from '../controllers/ClientsController.js';

const router = express.Router();
const clientsController = new ClientsController();

// ADMIN
router.get(
  '/',
  auth.required,
  storeAdminValidation,
  getAllValidation,
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
  searchValidation,
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
  getClientByIdValidation,
  clientsController.getClientById,
); // testado

router.put(
  '/admin/:id',
  auth.required,
  storeAdminValidation,
  updateAdminValidation,
  clientsController.updateAdmin,
); // testado

// CLIENT
router.get(
  '/show',
  auth.required,
  getClientValidation,
  clientsController.getClient, // testado
);

router.post('/', addValidation, clientsController.add); // testado

router.put('/', auth.required, updateValidation, clientsController.update); // testado

router.delete('/', auth.required, removeValidation, clientsController.remove); // testado

export default router;
