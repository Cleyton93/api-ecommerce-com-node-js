import express from 'express';

import DeliverysController from '../controllers/DeliverysController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
import * as validate from '../validations/deliverys-validation.js';

const router = express.Router();
const deliverysController = new DeliverysController();

router.get(
  '/:id',
  auth.required,
  validate.getByIdValidation,
  deliverysController.getById,
);

router.put(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  deliverysController.update,
);

router.post(
  '/calcular',
  validate.calculateValidation,
  deliverysController.calculate,
);

export default router;
