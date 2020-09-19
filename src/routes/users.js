import express from 'express';

import UsersController from '../controllers/UsersController.js';

import auth from '../config/auth.js';

import * as validate from '../validations/users-validation.js';

const router = express.Router();
const usersController = new UsersController();

router.get('/', auth.required, usersController.getUser); // testado

router.post('/login', validate.loginValidation, usersController.login); // testado

router.post('/register', validate.registerValidation, usersController.register); // testado

router.put(
  '/',
  auth.required,
  validate.updateValidation,
  usersController.update,
); // testado

router.delete('/', auth.required, usersController.remove); // testado

router.get('/recuperar-senha', usersController.showRecovery); // testado

router.post('/recuperar-senha', usersController.createRecovery); // testado

router.get('/senha-recuperada', usersController.showCompleteRecovery); // testado

router.post('/senha-recuperada', usersController.completeRecovery); // testado

router.get(
  '/:id',
  auth.required,
  validate.showValidation,
  usersController.getUserById,
); // testado

export default router;
