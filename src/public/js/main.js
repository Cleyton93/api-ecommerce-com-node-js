/* eslint-disable no-console */
/* eslint-disable no-undef */
const $formNewPass = document.querySelector('[data-js="form-new-pass"]');

if ($formNewPass) {
  $formNewPass.onsubmit = (e) => {
    e.preventDefault();

    const { pass: $pass, 'repeat-pass': $repeatPass } = e.target;
    const $alertPass = document.querySelector('[data-js="alert-pass"]');
    const $alertRepeatPass = document.querySelector(
      '[data-js="alert-repeat-pass"]',
    );

    $alertPass.classList.add('d-none');
    $alertRepeatPass.classList.add('d-none');
    $pass.classList.remove('is-invalid');
    $repeatPass.classList.remove('is-invalid');

    if ($pass.value.length < 8) {
      $alertPass.classList.remove('d-none');

      return $pass.classList.add('is-invalid');
    }

    if ($pass.value !== $repeatPass.value) {
      $alertRepeatPass.classList.remove('d-none');

      return $repeatPass.classList.add('is-invalid');
    }

    return $formNewPass.submit();
  };
}

/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable block-scoped-var */

const $btnGenerateToken = document.querySelector('[data-js="generate-token"]');

if ($btnGenerateToken) {
  $btnGenerateToken.onclick = async (e) => {
    try {
      const req = await fetch(`http://localhost:5000/pagamentos/session`);
      const res = await req.json();

      if (res.sessionId) {
        const idSessionPayment = res.sessionId;
        console.log('ID da sessão: ', idSessionPayment);

        PagSeguroDirectPayment.setSessionId(idSessionPayment);

        const hashUser = PagSeguroDirectPayment.getSenderHash();
        console.log('Hash: ', hashUser);

        let tokenCard = '';

        const month = '12';
        const year = '2030';
        const card = '4111111111111111';
        var bin = '411111';

        var brand = '';

        var params = {
          cardNumber: card,
          brand,
          cvv: '123',
          expirationMonth: month,
          expirationYear: year,
          success(response) {
            console.log('Credit Card Token: ', response);
            tokenCard = response.card.token;
          },
          error(err) {
            console.log(err);
          },
          complete(result) {
            console.log(result);
          },
        };
      }

      PagSeguroDirectPayment.getBrand({
        cardBin: bin,
        success(response) {
          console.log('Brand: ', response);
          brand = response.name;
          PagSeguroDirectPayment.createCardToken(params);
        },
        error(err) {
          console.log(err);
        },
        complete(result) {
          console.log(result);
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
}
