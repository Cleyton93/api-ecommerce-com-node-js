import express from 'express';

import auth from '../config/auth.js';

import {
  loginValidation,
  registerValidation,
  updateValidation,
  showValidation,
} from '../validations/users-validation.js';

import UsersController from '../controllers/UsersController.js';

const router = express.Router();
const usersController = new UsersController();

router.get('/', auth.required, usersController.getUser); // testado

router.post('/login', loginValidation, usersController.login); // testado

router.post('/register', registerValidation, usersController.register); // testado

router.put('/', auth.required, updateValidation, usersController.update); // testado

router.delete('/', auth.required, usersController.remove); // testado

router.get('/recuperar-senha', usersController.showRecovery);

router.post('/recuperar-senha', usersController.createRecovery);

router.get('/senha-recuperada', usersController.showCompleteRecovery);

router.post('/senha-recuperada', usersController.completeRecovery);

router.get('/:id', auth.required, showValidation, usersController.getUserById); // testado

export default router;
