import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import moment from 'moment';

import emailConfig from '../config/email.js';

dotenv.config();

const transporter = nodeMailer.createTransport(emailConfig);

const _send = ({ subject, emails, message }, cb = null) => {
  const mailOptions = {
    form: 'no-response@lojati.com',
    to: emails,
    subject,
    html: message,
  };

  // eslint-disable-next-line no-unused-vars
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.warn(error);

      if (cb) return cb(error);
    } else {
      return cb(null, true);
    }
  });
};

// NOVO PEDIDO
export const sendNewRequest = ({ user, request }) => {
  const message = `
    <h1 style="text-align: center;">Pedido Recebido</h1>
    <br />
    <p>O pedido realizado hoje, no dia ${moment(request.createdAt).format(
      'DD/MM/YYYY',
    )}, foi recebido com sucesso.</p>
    <br />
    <a href="${process.env.APP_URL}"></a>
    <br /><br />
    <p>Atenciosamente</p>
    <p>Equipe Loja TI</p>
  `;

  _send({
    subject: 'Pedido Recebido - Loja TI',
    emails: user.email,
    message,
  });
};

// PEDIDO CANCELADO
export const requestCanceled = ({ user, request }) => {
  const message = `
    <h1 style="text-align: center;">Pedido Cancelado</h1>
    <br />
    <p>O pedido realizado no dia ${moment(request.createdAt).format(
      'DD/MM/YYYY',
    )}, foi cancelado.</p>
    <br />
    <a href="${process.env.APP_URL}"></a>
    <br /><br />
    <p>Atenciosamente</p>
    <p>Equipe Loja TI</p>
  `;

  _send({
    subject: 'Pedido Cancelado - Loja TI',
    emails: user.email,
    message,
  });
};

// ATUALIZAÇÃO DE PAGAMENTO & ENTREGA
// eslint-disable-next-line no-unused-vars
export const updateRequest = ({ user, request, status, date, type }) => {
  const message = `
    <h1 style="text-align: center;">Pedido Atualizado</h1>
    <br />
    <p>O pedido realizado no dia ${moment(request.createdAt).format(
      'DD/MM/YYYY',
    )}, teve uma atualização.</p>
    <br />
    <p>Nova Atualização: ${status} - realizada em ${moment(date).format(
    'DD/MM/YYYY HH:mm',
  )}</p>


    <a href="${process.env.APP_URL}"></a>
    <br /><br />
    <p>Atenciosamente</p>
    <p>Equipe Loja TI</p>
  `;

  _send({
    subject: 'Pedido Atualizado - Loja TI',
    emails: user.email,
    message,
  });
};
