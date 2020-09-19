import Products from '../models/Products.js';
import Variations from '../models/Variations.js';

const getCartValue = (cart) => {
  const total = {
    cartTotalPrice: 0,
    cartQuantity: 0,
  };

  cart.forEach((item) => {
    total.cartTotalPrice += item.unitPrice * item.quantity;
    total.cartQuantity += item.quantity;
  });

  return total;
};

const getStoreValue = async (cart) => {
  const total = {
    storeTotalPrice: 0,
    storeQuantity: 0,
  };

  await Promise.all(
    cart.map(async (item) => {
      const product = await Products.findById(item.product);
      const variation = await Variations.findById(item.variation);

      if (product && variation && product.variations.includes(variation._id)) {
        const price = variation.promotion || variation.price;
        total.storeTotalPrice += price * item.quantity;
        total.storeQuantity += item.quantity;
      }

      return total;
    }),
  );

  return total;
};

export default async (cart) => {
  const { cartTotalPrice, cartQuantity } = getCartValue(cart);
  const { storeTotalPrice, storeQuantity } = await getStoreValue(cart);

  return cartTotalPrice === storeTotalPrice && cartQuantity === storeQuantity;
};
