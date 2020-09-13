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

router.get('/', storesController.getAll);

router.get('/:id', getByIdValidation, storesController.getById);

router.post('/', auth.required, addValidation, storesController.add);

router.put(
  '/',
  auth.required,
  storeAdminValidation,
  updateValidation,
  storesController.update,
);

router.delete(
  '/',
  auth.required,
  removeValidation,
  storeAdminValidation,
  storesController.remove,
);

export default router;
