/* eslint-disable no-undef */
const $formNewPass = document.querySelector('[data-js="form-new-pass"]');

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
