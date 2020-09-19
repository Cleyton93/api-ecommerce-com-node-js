import Correios from 'node-correios';

import config from '../../config/correios.js';
import calcBox from '../../helpers/calcBox.js';

const correios = new Correios();

const handleProducts = (products) => {
  return products.map((product) => ({
    pesoKg: product.variation.delivery.weightKg,
    profundidadeCm: product.variation.delivery.dimensions.depthCm,
    larguraCm: product.variation.delivery.dimensions.widthCm,
    alturaCm: product.variation.delivery.dimensions.heightCm,
    quantidade: product.quantity,
    preco: product.unitPrice,
  }));
};

const calculateShipping = async ({ cep, products }) => {
  const productsData = handleProducts(products);

  const box = calcBox(productsData);
  const totalWeight = productsData.reduce(
    (acc, product) => acc + product.pesoKg * product.quantidade,
    0,
  );
  const totalPrice = productsData.reduce(
    (acc, product) => acc + product.preco * product.quantidade,
    0,
  );

  try {
    const result = await Promise.all(
      config.nCdServico.split(',').map(async (servico) => {
        const res = await correios.calcPrecoPrazo({
          nCdServico: servico,
          sCepOrigem: config.sCepOrigem,
          sCepDestino: cep,
          nVlPeso: totalWeight,
          nCdFormato: 1,
          nVlComprimento: box.comprimento,
          nVlAltura: box.altura,
          nVlLargura: box.largura,
          nVlDiamentro: 0,
          nVlValorDeclarado: totalPrice < 20.5 ? 20.5 : totalPrice,
        });
        return { ...res[0] };
      }),
    );

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

export default calculateShipping;
