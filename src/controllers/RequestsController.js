import Requests from '../models/Requests.js';
import Clients from '../models/Clients.js';
import Payments from '../models/Payments.js';
import Deliverys from '../models/Deliverys.js';
import Users from '../models/Users.js';
import RegisterRequests from '../models/RegisterRequests.js';

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

import { sendNewRequest } from './EmailController.js';

class RequestsController {
  // ADMIN
  // async adminGetAll(req, res, next) {}
  // async adminGetById(req, res, next) {}
  // async adminRemove(req, res, next) {}
  // async adminGetCart(req, res, next) {}
  // CLIENT
  // async getAll(req, res, next) {}
  // async getById(req, res, next) {}
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

      if (!(await checkCard(payment)))
        return res
          .status(400)
          .json({ error: 'Dados de pagamento com cartão inválidos.' });

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
      console.log('chegou aqui');

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
  // async remove(req, res, next) {}
  // async getCart(req, res, next) {}
}

export default RequestsController;
