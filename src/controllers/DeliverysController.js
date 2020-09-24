import Deliverys from '../models/Deliverys.js';
import RegisterRequests from '../models/RegisterRequests.js';
import Requests from '../models/Requests.js';
import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

import { updateRequest } from './EmailController.js';

import calculateShipping from '../integrations/correios.js';

class DeliverysController {
  // GET /:id
  async getById(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;

    try {
      const delivery = await Deliverys.findOne({ _id, store });

      if (!delivery)
        return res.status(400).json({ error: 'Entrega não econtrada.' });

      const registers = await RegisterRequests.find({
        request: delivery.request,
        type: 'entrega',
      });

      return res.json({ delivery, registers });
    } catch (err) {
      return next(err);
    }
  }

  // PUT /:id
  async update(req, res, next) {
    const { id: _id } = req.params;
    const { store } = req.query;
    const { status, trackingCode } = req.body;

    try {
      const delivery = await Deliverys.findOne({ _id, store });

      if (!delivery)
        return res.status(400).json({ error: 'Entrega não encontrada.' });

      if (status) delivery.status = status;
      if (trackingCode) delivery.trackingCode = trackingCode;

      const registerRequest = new RegisterRequests({
        request: delivery.request,
        type: 'entrega',
        status: status || 'update_entrega',
        payload: req.body,
      });

      const request = await Requests.findOne({
        _id: delivery.request,
        store,
      }).populate({ path: 'client', populate: 'user' });

      updateRequest({
        user: request.client.user,
        request,
        type: 'entrega',
        status,
        date: new Date(),
      });

      await registerRequest.save();
      await delivery.save();

      return res.json({ delivery });
    } catch (err) {
      return next(err);
    }
  }

  // POST /calcular
  async calculate(req, res, next) {
    const { store } = req.query;
    const { cep, cart: cartData } = req.body;

    try {
      const cart = await Promise.all(
        cartData.map(async (cart) => {
          cart.product = await Products.findOne({ _id: cart.product, store });
          cart.variation = await Variations.findOne({
            _id: cart.variation,
            store,
          });

          return cart;
        }),
      );

      const result = await calculateShipping({
        cep,
        products: cart,
      });

      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  }
}

export default DeliverysController;
