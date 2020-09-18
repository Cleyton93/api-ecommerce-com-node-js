import express from 'express';

import VariationsController from '../controllers/VariationsController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
import * as validate from '../validations/variations-validation.js';

import upload from '../config/multer.js';

const router = express.Router();
const variationsController = new VariationsController();

router.get('/', validate.getAllValidation, variationsController.getAll); // testado

router.get('/:id', validate.getByIdValidation, variationsController.getById); // testado

router.post(
  '/',
  auth.required,
  storeAdminValidation,
  validate.addValidation,
  variationsController.add,
); // testado

router.put(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  variationsController.update,
); // testado

router.put(
  '/images/:id',
  auth.required,
  storeAdminValidation,
  validate.uploadImagesValidation,
  upload.array('files', 4),
  variationsController.uploadImages,
); // testado

router.delete(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.removeValidation,
  variationsController.remove,
); // testado

router.delete(
  '/:id/image',
  auth.required,
  storeAdminValidation,
  validate.removeImageValidation,
  variationsController.removeImage,
); // testado

export default router;
