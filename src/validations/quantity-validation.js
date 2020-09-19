import Variations from '../models/Variations.js';

export const availableQuantityValidation = async (_cart) => {
  let everyoneHasQuantityAvailable = true;

  try {
    const cart = await Promise.all(
      _cart.map(async (item) => {
        return {
          ...item,
          variation: await Variations.findById(item.variation),
        };
      }),
    );

    cart.forEach((item) => {
      if (!item.variation.quantity || item.variation.quantity < item.quatity) {
        everyoneHasQuantityAvailable = false;
      }
    });

    return everyoneHasQuantityAvailable;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const updateQuantityValidation = async (
  type,
  request,
  previousStatus,
) => {
  try {
    const cart = request.cart.map(async (item) => {
      item.variation = await Variations.findById(
        item.variation || item.variation._id,
      );

      if (type === 'salvar_pedido') {
        item.variation.quantity -= item.quantity;
        item.variation.quantityBlock += item.quantity;
      }

      if (type === 'confirmar_pedido' && previousStatus === 'iniciando')
        item.variation.quantityBlock -= item.quantity;

      if (type === 'confirmar_pedido' && previousStatus === 'Cancelada') {
        item.variation.quantity -= item.quantity;
      }

      if (type === 'cancelar_pedido' && previousStatus === 'iniciando') {
        item.variation.quantity += item.quantity;
        item.variation.quantityBlock -= item.quantity;
      }

      if (type === 'cancelar_pedido' && previousStatus === 'Paga') {
        item.variation.quantity += item.quantity;
      }

      await item.variation.save();
      return item;
    });

    await Promise.all(cart);
  } catch (err) {
    console.warn(err);
  }
};
