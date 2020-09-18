import express from 'express';

import RatingsController from '../controllers/RatingsController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
import * as validate from '../validations/ratings-validation.js';

const router = express.Router();
const ratingsController = new RatingsController();

router.get('/', validate.getAllValidation, ratingsController.getAll); // testado

router.get('/:id', validate.getByIdValidation, ratingsController.getById); // testado

router.post('/', auth.required, validate.addValidation, ratingsController.add); // testado

router.delete(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.removeValidation,
  ratingsController.remove,
); // testado

export default router;
