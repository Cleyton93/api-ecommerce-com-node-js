import express from 'express';

import CategoriesController from '../controllers/CategoriesController.js';

import auth from '../config/auth.js';

import * as validate from '../validations/categories-validation.js';
import storeAdminValidation from '../validations/stores-validation.js';

const router = express.Router();
const categoriesController = new CategoriesController();

router.get('/', validate.getAllValidation, categoriesController.getAll); // testado

router.get(
  '/disponiveis',
  validate.getAllAvailablesValidation,
  categoriesController.getAllAvailables,
); // testado

router.get('/:id', validate.getByIdValidation, categoriesController.getById); // testado

router.get(
  '/search/:search',
  validate.searchValidation,
  categoriesController.search,
); // testado

router.post(
  '/',
  auth.required,
  storeAdminValidation,
  validate.addValidation,
  categoriesController.add,
); // testado

router.put(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  categoriesController.update,
); // testado

router.delete(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.removeValidation,
  categoriesController.remove,
); // testado

router.get(
  '/id:/produtos',
  validate.showProductsValidation,
  categoriesController.showProducts,
); // testado

router.put(
  '/:id/produtos',
  auth.required,
  storeAdminValidation,
  validate.updateListProductsValidation,
  categoriesController.updateListProducts,
); // testado

export default router;
