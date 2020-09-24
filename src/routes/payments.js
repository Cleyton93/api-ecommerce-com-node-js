import express from 'express';
import dotenv from 'dotenv';

import PaymentsController from '../controllers/PaymentsController.js';

import auth from '../config/auth.js';

import storeAdminValidation from '../validations/stores-validation.js';
import * as validate from '../validations/payments-validation.js';

dotenv.config();

const router = express.Router();
const paymentsController = new PaymentsController();

// TESTE
if (process.env.ENVIRONMENT === 'development')
  router.get('/tokens', (req, res) => res.render('pagseguro/index'));

// PAGSEGURO
router.post('/notificacao', paymentsController.viewNotifications);

router.get('/session', paymentsController.getSessionId);

// CLIENT
router.get(
  '/:id',
  auth.required,
  validate.getByIdValidation,
  paymentsController.getById,
);

router.post(
  '/pagar/:id',
  auth.required,
  validate.payValidation,
  paymentsController.pay,
);

// ADMIN
router.put(
  '/:id',
  auth.required,
  storeAdminValidation,
  validate.updateValidation,
  paymentsController.update,
);

export default router;
