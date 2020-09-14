import express from 'express';

import auth from '../config/auth.js';

import storeAdminValidation, {
  getByIdValidation,
  addValidation,
  updateValidation,
  removeValidation,
} from '../validations/stores-validation.js';

import StoresController from '../controllers/StoresController.js';

const router = express.Router();
const storesController = new StoresController();

router.get('/', storesController.getAll); // testado

router.get('/:id', getByIdValidation, storesController.getById); // testado

router.post('/', auth.required, addValidation, storesController.add); // testado

router.put(
  '/',
  auth.required,
  storeAdminValidation,
  updateValidation,
  storesController.update,
); // testado

router.delete(
  '/',
  auth.required,
  removeValidation,
  storeAdminValidation,
  storesController.remove,
); // testado

export default router;
