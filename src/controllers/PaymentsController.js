import Payments from '../models/Payments.js';
import Requests from '../models/Requests.js';
import RegisterRequests from '../models/RegisterRequests.js';
import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

import { updateRequest } from './EmailController.js';

import {
  createPayment,
  getSessionId,
  getNotification,
  getTransactionStatus,
} from '../integrations/pagseguro.js';

import { updateQuantityValidation } from '../validations/quantity-validation.js';

class PaymentsController {
  // CLIENTS
  // GET /:id
  async getById(req, res, next) {
    const { store } = req.query;
    const { id: _id } = req.params;

    try {
      const payment = await Payments.findOne({ _id, store });
      if (!payment) {
        return res.status(400).send({ error: 'Pagamento não existe' });
      }

      const register = await RegisterRequests.find({
        request: payment.request,
        type: 'pagamento',
      });

      const status = payment.pagSeguroCode
        ? await getTransactionStatus(payment.pagSeguroCode)
        : null;

      if (
        status &&
        (register.length === 0 ||
          !register[register.length - 1].payload ||
          !register[register.length - 1].payload.code ||
          register[register.length - 1].payload.code !== status.code)
      ) {
        const registerRequest = new RegisterRequests({
          request: payment.request,
          type: 'pagamento',
          status: status.status || 'Situacao',
          payload: status,
        });

        payment.status = status.status;
        await registerRequest.save();
        await payment.save();
        register.push(registerRequest);
      }

      return res.send({ payment, register, status });
    } catch (err) {
      return next(err);
    }
  }

  // POST /:id
  async pay(req, res, next) {
    const { senderHash } = req.body;
    const { store } = req.query;
    const { id: _id } = req.params;

    try {
      const payment = await Payments.findOne({ _id, store });

      if (!payment)
        return res.status(400).send({ error: 'Pagamento não existe' });

      const request = await Requests.findById(payment.request).populate([
        { path: 'client', populate: 'user' },
        { path: 'delivery' },
        { path: 'payment' },
      ]);

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.cart = await Promise.all(
        request.cart.map(async (item) => {
          item.product = await Products.findById(item.product);
          item.variation = await Variations.findById(item.variation);

          return item;
        }),
      );

      const payload = await createPayment(senderHash, request);

      payment.payload = payment.payload
        ? payment.payload.concat(payload)
        : [payload];

      if (payload.code) payment.pagSeguroCode = payload.code;

      await payment.save();

      return res.send({ payment, payload });
    } catch (err) {
      return next(err);
    }
  }

  // ADMIN
  async update(req, res, next) {
    const { status } = req.body;
    const { store } = req.query;
    const { id: _id } = req.params;

    try {
      const payment = await Payments.findOne({ _id, store });
      if (!payment)
        return res.status(400).send({ error: 'Pagamento não existe' });

      if (payment.status === status)
        return res
          .status(400)
          .send({ error: `O status de pagamento já está como "${status}".` });

      const registerRequest = new RegisterRequests({
        request: payment.request,
        type: 'pagamento',
        status,
      });

      const request = await Requests.findOne({
        _id: payment.request,
        store,
      }).populate({ path: 'client', populate: 'user' });

      updateRequest({
        user: request.client.user,
        request,
        type: 'pagamento',
        status,
        date: new Date(),
      });

      if (status && status === 'Paga') {
        await updateQuantityValidation(
          'confirmar_pedido',
          request,
          payment.status,
        );

        payment.status = status;
      } else if (status && status === 'Cancelada') {
        await updateQuantityValidation(
          'cancelar_pedido',
          request,
          payment.status,
        );

        payment.status = status;
      }

      await registerRequest.save();
      await payment.save();

      return res.send({ payment });
    } catch (err) {
      return next(err);
    }
  }

  // PAGSEGURO
  async getSessionId(req, res, next) {
    try {
      const sessionId = await getSessionId();
      return res.send({ sessionId });
    } catch (err) {
      return next(err);
    }
  }

  async viewNotifications(req, res, next) {
    try {
      const { notificationCode, notificationType } = req.body;
      if (notificationType !== 'transaction')
        return res.send({ success: true });

      const result = await getNotification(notificationCode);

      const payment = await Payments.findOne({ pagSeguroCode: result.code });

      if (!payment)
        return res.status(400).send({ error: 'Pagamento não existe' });

      const status = payment.pagSeguroCode
        ? await getTransactionStatus(payment.pagSeguroCode)
        : null;

      if (payment.status === status.status)
        return res.status(400).send({
          error: `O status de pagamento já está como "${status.status}`,
        });

      const register = await RegisterRequests.find({
        request: payment.request,
        type: 'pagamento',
      });

      if (
        status &&
        (register.length === 0 ||
          !register[register.length - 1].payload ||
          register[register.length - 1].payload.code !== status.code)
      ) {
        const registerRequest = new RegisterRequests({
          request: payment.request,
          type: 'pagamento',
          status: status.status || 'Situacao',
          payload: status,
        });

        await registerRequest.save();

        register.push(registerRequest);

        const request = await Requests.findById(payment.request).populate({
          path: 'client',
          populate: 'user',
        });

        updateRequest({
          user: request.client.user,
          request,
          type: 'pagamento',
          status: status.status,
          date: new Date(),
        });

        if (status.status === 'Paga') {
          await updateQuantityValidation(
            'confirmar_pedido',
            request,
            payment.status,
          );
        } else if (status.status === 'Cancelada') {
          await updateQuantityValidation(
            'cancelar_pedido',
            request,
            payment.status,
          );
        }

        payment.status = status.status;
        await payment.save();
      }

      return res.send({ success: true });
    } catch (err) {
      return next(err);
    }
  }
}

export default PaymentsController;
