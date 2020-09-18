import express from 'express';

import ProductsController from '../controllers/ProductsController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
import * as validate from '../validations/products-validation.js';

import upload from '../config/multer.js';

const router = express.Router();
const productsController = new ProductsController();

// ADMIN
router.post(
  '/',
  auth.required,
  storeAdminValidation,
  validate.addValidation,
  productsController.add,
); // testado

router.put(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  productsController.update,
); // testado

router.put(
  '/images/:id',
  auth.required,
  storeAdminValidation,
  validate.uploadImagesValidation,
  upload.array('files', 4),
  productsController.uploadImages,
); // testado

router.delete(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.removeValidation,
  productsController.remove,
); // testado

router.delete(
  '/image/:id',
  auth.required,
  storeAdminValidation,
  validate.removeImageValidation,
  productsController.removeImage,
); // testado

// CLIENTES E VISITANTES
router.get('/', validate.getAllValidation, productsController.getAll); // testado

router.get(
  '/disponiveis',
  validate.getAllAvailablesValidation,
  productsController.getAllAvailables,
); // testado

router.get(
  '/search/:search',
  validate.searchValidation,
  productsController.search,
); // testado

router.get('/:id', validate.getByIdValidation, productsController.getById); // testado

// VARIATIONS
router.get(
  '/:id/variacoes',
  validate.getVariationsValidation,
  productsController.getVariations,
); // testado

// RATINGS
router.get(
  '/:id/avaliacoes',
  validate.getRatingsValidation,
  productsController.getRatings,
); // testado

export default router;
