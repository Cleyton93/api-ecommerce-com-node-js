export default {
  mode: process.env.ENVIRONMENT === 'production' ? 'live' : 'sandbox',
  sandbox: process.env.ENVIRONMENT !== 'production',
  sandbox_email:
    process.env.ENVIRONMENT === 'production'
      ? null
      : 'c28706697651830458204@sandbox.pagseguro.com.br',
  email: 'cleyton.do.vale.sa@gmail.com',
  token: '25E4FB22F17B4CBDB74C72A3269D7744',
  notificationURL: `${process.env.API_URL}payments/notificacao`,
};
