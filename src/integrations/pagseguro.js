import moment from 'moment';

import pagSeguroConfig from '../config/pagseguro.js';
import PagSeguro from '../helpers/pagseguro.js';

const _createPaymentWithBoleto = (
  senderHash,
  { client, cart, delivery, payment },
) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.setSender({
      name: client.name,
      email: client.user.email,
      cpf_cnpj: client.cpf.replace(/[-.]/g, ''),
      area_code: client.phones[0].slice(0, 2),
      phone: client.phones[0].slice(2).trim(),
      birth_date: moment(client.dateOfBirth).format('DD/MM/YYYY'), // formato DD/MM/YYYY
    });

    pag.setShipping({
      street: delivery.address.location,
      number: delivery.address.number,
      district: delivery.address.neighborhood,
      city: delivery.address.city,
      state: delivery.address.state,
      postal_code: delivery.address.zipcode.replace(/[-.]/g, ''),
      same_for_billing: payment.deliveryAddressSameAsBilling, // true ou false
    });

    pag.setBilling({
      street: payment.address.location,
      number: payment.address.number,
      district: payment.address.neighborhood,
      city: payment.address.city,
      state: payment.address.state,
      postal_code: payment.address.zipcode.replace(/[-.]/g, ''),
    });

    cart.forEach((item) => {
      pag.addItem({
        qtde: item.quantity,
        value: item.unitPrice,
        description: `${item.product.title}-${item.variation.name}`,
      });
    });

    pag.addItem({
      qtde: 1,
      value: delivery.cost,
      description: 'Custo de entrega - Correios',
    });

    pag.sendTransaction(
      {
        method: 'boleto',
        value: payment.value,
        installments: 1,
        hash: senderHash,
      },
      (err, data) => (!err ? resolve(data) : reject(err)),
    );
  });
};

const _createPaymentWithCreditCard = (
  senderHash,
  { client, delivery, cart, payment },
) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);

    pag.setSender({
      name: client.name,
      email: client.user.email,
      cpf_cnpj: client.cpf.replace(/[-.]/g, ''),
      area_code: client.phones[0].slice(0, 2),
      phone: client.phones[0].slice(2).trim(),
      birth_date: moment(client.dateOfBirth).format('DD/MM/YYYY'), // formato DD/MM/YYYY
    });

    pag.setShipping({
      street: delivery.address.location,
      number: delivery.address.number,
      district: delivery.address.neighborhood,
      city: delivery.address.city,
      state: delivery.address.state,
      postal_code: delivery.address.zipcode.replace(/[-.]/g, ''),
      same_for_billing: payment.deliveryAddressSameAsBilling, // true ou false
    });

    pag.setBilling({
      street: payment.address.location,
      number: payment.address.number,
      district: payment.address.neighborhood,
      city: payment.address.city,
      state: payment.address.state,
      postal_code: payment.address.zipcode.replace(/[-.]/g, ''),
    });

    cart.forEach((item) => {
      pag.addItem({
        qtde: item.quantity,
        value: item.unitPrice,
        description: `${item.product.title}-${item.variation.name}`,
      });
    });

    pag.addItem({
      qtde: 1,
      value: delivery.cost,
      description: 'Custo de entrega - Correios',
    });

    pag.setCreditCardHolder({
      name: payment.card.fullName || client.name,
      area_code: payment.card.areaCode.trim() || client.phones[0].slice(0, 2),
      phone: payment.card.phone.slice(2) || client.phones[0].slice(2),
      birth_date:
        moment(payment.card.dateOfBirth).format('DD/MM/YYYY') ||
        moment(client.dateOfBirth).format('DD/MM/YYYY'),
      cpf_cnpj:
        payment.card.cpf.replace(/[-.]/g, '') ||
        client.cpf.replace(/[-.]/g, ''),
    });

    console.log(payment);

    pag.sendTransaction(
      {
        method: 'creditCard',
        value:
          payment.value % 2 !== 0 && payment.parceled !== 1
            ? payment.value + 0.01
            : payment.value,
        installments: payment.parceled,
        hash: senderHash,
        credit_card_token: payment.card.credit_card_token,
      },
      (err, data) => (!err ? resolve(data) : reject(err)),
    );
  });
};

export const createPayment = async (senderHash, data) => {
  try {
    if (data.payment.form === 'boleto') {
      return await _createPaymentWithBoleto(senderHash, data);
    }
    if (data.payment.form === 'creditCard') {
      return await _createPaymentWithCreditCard(senderHash, data);
    }

    return { errorMessage: 'Forma de pagamento não encontrada' };
  } catch (err) {
    return { errorMessage: 'Ocorreu um erro', errors: err };
  }
};

export const getSessionId = () => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.sessionId((err, sessionId) =>
      !err ? resolve(sessionId) : reject(err),
    );
  });
};

export const getTransactionStatus = (code) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.transactionStatus(code, (err, result) =>
      !err ? resolve(result) : reject(err),
    );
  });
};

export const getNotification = (code) => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.getNotification(code, (err, result) =>
      !err ? resolve(result) : reject(err),
    );
  });
};
