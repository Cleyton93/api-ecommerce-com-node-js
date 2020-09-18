import express from 'express';

import StoresController from '../controllers/StoresController.js';

import auth from '../config/auth.js';

import storeAdminValidation, * as validate from '../validations/stores-validation.js';

const router = express.Router();
const storesController = new StoresController();

router.get('/', storesController.getAll); // testado

router.get('/:id', validate.getByIdValidation, storesController.getById); // testado

router.post('/', auth.required, validate.addValidation, storesController.add); // testado

router.put(
  '/',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  storesController.update,
); // testado

router.delete(
  '/',
  auth.required,
  storeAdminValidation,
  validate.removeValidation,
  storesController.remove,
); // testado

export default router;
