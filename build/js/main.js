'use strict';

var creditForm = document.querySelector('#credit-form');
var creditPlusButton = document.querySelector('.credit__value-button--plus');
var creditMinusButton = document.querySelector('.credit__value-button--minus');
var creditValueInput = document.querySelector('#credit__value');

var firstPaymentSlider = document.querySelector('#credit__first-payment-slider-input');
var firstPaymentInput = document.querySelector('#credit__first-payment');
var firstPaymentPercent = document.querySelector('#credit__first-payment-percent');

// процентная ставка
var percentRate; // значение процентной ставки
var percentRateMax = 9.4;
var percentRateMin = 8.5;
var percentChangeLimit = 15; // значение, после которого меняется процентная ставка

// увеличение и уменьшение суммы кредита по клику
creditPlusButton.addEventListener('click', function () {
  event.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) + 100000;
});

creditMinusButton.addEventListener('click', function () {
  event.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) - 100000;
});

// изменение первоначального взноса
// ? как сделать, чтобы при изменении суммы кредита тоже пересчет шел? creditForm не помогает
firstPaymentSlider.addEventListener('change', function () {
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * 0.01;
  firstPaymentPercent.innerHTML = firstPaymentSlider.value + '%';
  // console.log(firstPaymentSlider.value); // проблема в том, что изменение происходит только при отпускании мыши

  // изменение процентной ставки
  if (Number(firstPaymentSlider.value) < percentChangeLimit) {
    percentRate = percentRateMax;
    percentRateMonth = percentRate / 12; // как нормально объявить данную переменную?
  } else {
    percentRate = percentRateMin;
    percentRateMonth = percentRate / 12;
  }

  console.log(monthPayment); // не отображает корректное значение, хотя формула считает

});

var years = 5; // временно, срок ипотеки 5 лет
var percentRateMonth;
var months = years * 12;
var monthPayment = Number(creditValueInput.value) * (percentRateMonth + percentRateMonth / (Math.pow((1 + percentRateMonth), months) - 1));

