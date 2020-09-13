import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';

import emailConfig from '../config/email.js';

dotenv.config();

const transporter = nodeMailer.createTransport(emailConfig);

export default ({ user, token }, cb) => {
  const message = `
    <h1 style="test-align: center"></h1>
    <br />
    <p>
      Aqui está o link para receber a sua senha, Acese ele e digite sua nova senha:
    </p>
    <a href="${process.env.API_URL}users/senha-recuperada?token=${token}">
      ${process.env.API_URL}users/senha-recuperada?token=${token}
    </a>
    <br /><br />
    <p>
      Obs: Se você não solicitou a redefinição apenas ignore esse email.
    </p>
    <p>Atenciosamente, Loja TI</p>
  `;

  const mailOptions = {
    from: 'no-response@lojati.com',
    to: user.email,
    subject: 'Redefinição de Senha - Loja TI',
    html: message,
  };

  return transporter.sendMail(mailOptions, (err) => {
    if (!err) {
      return cb(
        null,
        'Link para redefinição de senha enviado com sucesso para seu E-mail.',
      );
    }

    return cb('Aconteceu um erro no envio do E-mail, tente novamente.');
  });
};
