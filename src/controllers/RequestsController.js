import Requests from '../models/Requests.js';
import Clients from '../models/Clients.js';
import Payments from '../models/Payments.js';
import Deliverys from '../models/Deliverys.js';
import Users from '../models/Users.js';
import RegisterRequests from '../models/RegisterRequests.js';
import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

import cartsValidation from '../validations/carts-validation.js';

import {
  availableQuantityValidation,
  updateQuantityValidation,
} from '../validations/quantity-validation.js';

import checkDeliveryValue from '../validations/deliverys-validation.js';

import {
  checkTotalValue,
  checkCard,
} from '../validations/payments-validation.js';

import { requestCanceled, sendNewRequest } from './EmailController.js';

class RequestsController {
  // ADMIN
  // GET /admin
  async adminGetAll(req, res, next) {
    const { offset, limit, store } = req.query;

    try {
      const requests = await Requests.paginate(
        { store },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
        },
      );

      requests.docs = await Promise.all(
        requests.docs.map(async (request) => {
          request.cart = await Promise.all(
            request.cart.map(async (cart) => {
              cart.product = await Products.findById(cart.product);
              cart.variation = await Variations.findById(cart.variation);

              return cart;
            }),
          );

          return request;
        }),
      );

      return res.json({ requests });
    } catch (err) {
      return next(err);
    }
  }

  // GET /admin/:id
  async adminGetById(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const request = await Requests.findOne({ store, _id }).populate([
        'client',
        'cart',
        'payment',
      ]);

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.cart = await Promise.all(
        request.cart.map(async (cart) => {
          cart.product = await Products.findById(cart.product);
          cart.variation = await Variations.findById(cart.variation);

          return cart;
        }),
      );

      const registerRequests = await RegisterRequests.find({
        request: request._id,
      });

      return res.json({ request, registerRequests });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /admin/:id
  async adminRemove(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const request = await Requests.findOne({ _id, store }).populate([
        {
          path: 'client',
          populate: 'user',
        },
        { path: 'payment' },
      ]);

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.canceled = true;

      await updateQuantityValidation(
        'cancelar_pedido',
        request,
        request.payment.status,
      );

      request.payment.status = 'Cancelada';
      await request.payment.save();

      const registerRequest = new RegisterRequests({
        request: request._id,
        type: 'pedido',
        status: 'pedido_cancelado',
      });

      await registerRequest.save();

      requestCanceled({ user: request.client.user, request });

      await request.save();

      return res.json({ canceled: true });
    } catch (err) {
      return next(err);
    }
  }

  // GET /admin/:id/carrinho
  async adminGetCart(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const request = await Requests.findOne({ store, _id });

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.cart = await Promise.all(
        request.cart.map(async (cart) => {
          cart.product = await Products.findById(cart.product);
          cart.variation = await Variations.findById(cart.variation);

          return cart;
        }),
      );

      return res.json({ cart: request.cart });
    } catch (err) {
      return next(err);
    }
  }

  // CLIENT
  // GET
  async getAll(req, res, next) {
    const { id: user } = req.payload;
    const { offset, limit, store } = req.query;

    try {
      const client = await Clients.findOne({ user, store });

      if (!client)
        return res.status(400).json({ error: 'Cliente não econtrado.' });

      const requests = await Requests.paginate(
        { store, client: client._id },
        {
          offset: Number(offset) || 0,
          limit: Number(limit) || 30,
        },
      );

      requests.docs = await Promise.all(
        requests.docs.map(async (request) => {
          request.cart = await Promise.all(
            request.cart.map(async (cart) => {
              cart.product = await Products.findById(cart.product);
              cart.variation = await Variations.findById(cart.variation);

              return cart;
            }),
          );

          return request;
        }),
      );

      return res.json({ requests });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id
  async getById(req, res, next) {
    const { id: user } = req.payload;
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const client = await Clients.findOne({ store, user });

      if (!client)
        return res.status(400).json({ error: 'Cliente não encontrado.' });

      const request = await Requests.findOne({
        _id,
        store,
        client: client._id,
      });

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.cart = await Promise.all(
        request.cart.map(async (cart) => {
          cart.product = await Products.findById(cart.product);
          cart.variation = await Variations.findById(cart.variation);

          return cart;
        }),
      );

      const registerRequest = await RegisterRequests.find({
        request: request._id,
      });

      return res.json({ request, registerRequest });
    } catch (err) {
      return next(err);
    }
  }

  async add(req, res, next) {
    const { id: user } = req.payload;
    const { store } = req.query;
    const { cart, payment, delivery } = req.body;

    const cartBackUp = [];

    cart.forEach((item) => {
      cartBackUp.push({ ...item });
    });

    try {
      const client = await Clients.findOne({ user, store });

      if (!client)
        return res.status(401).json({ error: 'Cliente não econtrado.' });

      if (!(await cartsValidation(cart)))
        return res.status(422).json({ error: 'Carrinho inválido.' });

      if (!(await availableQuantityValidation(cart))) {
        return res
          .status(400)
          .json({ error: 'Produto não possui quantidade disponível.' });
      }

      if (!(await checkDeliveryValue(delivery.address.zipcode, cart, delivery)))
        return res.status(400).json({ error: 'Dados de entrega inválidos.' });

      if (!(await checkTotalValue({ cart, delivery, payment })))
        return res.status(400).json({ error: 'Dados de pagamento inválidos.' });

      if (!checkCard(payment)) {
        return res
          .status(400)
          .json({ error: 'Dados de pagamento com cartão inválidos.' });
      }

      const newPayment = new Payments({
        store,
        value: payment.value,
        parceled: payment.parceled || 1,
        form: payment.form,
        status: 'iniciando',
        address: payment.address,
        card: payment.card,
        deliveryAddressSameAsBilling: payment.deliveryAddressSameAsBilling,
      });

      const newDelivery = new Deliverys({
        store,
        status: 'Não iniciado',
        cost: delivery.cost,
        deadline: delivery.deadline,
        type: delivery.type,
        address: delivery.address,
      });

      const request = new Requests({
        store,
        client: String(client._id),
        cart: cartBackUp,
        payment: String(newPayment._id),
        delivery: String(newDelivery._id),
      });

      newPayment.request = request._id;
      newDelivery.request = request._id;

      await newPayment.save();
      await newDelivery.save();

      await request.save();

      await updateQuantityValidation('salvar_pedido', request);

      const registerRequests = new RegisterRequests({
        request: request._id,
        type: 'pedido',
        status: 'pedido_criacao',
      });

      await registerRequests.save();

      sendNewRequest({ request, user: client.user });

      const admins = await Users.find({ permissions: 'admin', store });

      admins.forEach((admin) => {
        sendNewRequest({ request, user: admin });
      });

      return res.json({
        request: {
          ...request._doc,
          ...{ delivery: newDelivery, payment: newPayment },
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  // DELETE /:id
  async remove(req, res, next) {
    const { id: user } = req.payload;
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const client = await Clients.findOne({ user, store });

      if (!client)
        return res.status(400).json({ error: 'Cliente não encontrado.' });

      const request = await Requests.findOne({
        store,
        _id,
        client: client._id,
      }).populate('payment');

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.canceled = true;
      await request.save();

      await updateQuantityValidation(
        'cancelar_pedido',
        request,
        request.payment.status,
      );

      request.payment.status = 'Cancelada';
      await request.payment.save();

      const registerRequests = new RegisterRequests({
        request: String(request._id),
        type: 'pedido',
        status: 'pedido_cancelado',
      });

      await registerRequests.save();

      requestCanceled({ request, user: client.user });

      const admins = await Users.find({ permissions: 'admin', store });

      admins.forEach((admin) => {
        requestCanceled({ request, user: admin });
      });

      return res.json({ canceled: true });
    } catch (err) {
      return next(err);
    }
  }

  // GET /:id/carrinho
  async getCart(req, res, next) {
    const { id: user } = req.payload;
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const client = await Clients.findOne({ user, store });

      if (!client)
        return res.status(400).json({ error: 'Cliente não econtrado.' });

      const request = await Requests.findOne({
        store,
        _id,
        client: client._id,
      });

      if (!request)
        return res.status(400).json({ error: 'Pedido não encontrado.' });

      request.cart = await Promise.all(
        request.cart.map(async (cart) => {
          cart.product = await Products.findById(cart.product);
          cart.variation = await Variations.findById(cart.variation);

          return cart;
        }),
      );

      return res.json({ cart: request.cart });
    } catch (err) {
      return next(err);
    }
  }
}

export default RequestsController;
