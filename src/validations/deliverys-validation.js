import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

import calculateShipping from '../integrations/correios.js';

const checkDeliveryValue = async (cep, cart, delivery) => {
  try {
    const cartData = await Promise.all(
      cart.map(async (item) => {
        item.product = await Products.findById(item.product);
        item.variation = await Variations.findById(item.variation);

        return item;
      }),
    );

    const results = await calculateShipping({ cep, products: cartData });

    let found = false;

    results.forEach((result) => {
      if (
        result.Codigo.toString() === delivery.type.toString() &&
        Number(result.Valor.replace(/,/g, '.')) === Number(delivery.cost) &&
        result.PrazoEntrega.toString() === delivery.deadline.toString()
      )
        found = true;
    });

    return found;
  } catch (e) {
    return false;
  }
};

export default checkDeliveryValue;
