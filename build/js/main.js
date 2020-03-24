'use strict';

// процентная ставка
var PERCENT_MAX = 9.4;
var PERCENT_MIN = 8.5;
var PERCENT_CHANGE_LIMIT = 15; // значение, после которого меняется процентная ставка
var PERCENT_COEF = 0.01;

// шаги
var HYPOTHEC_CREDIT_STEP = 100000;

// остальное
var MONTHS_PER_YEAR = 12;
var REQUIRED_PROFIT_RATIO = 0.45;
var MOTH_CAP = 470000;

// размер кредита
var creditForm = document.querySelector('#credit-form');
var creditPlusButton = document.querySelector('.credit__value-button--plus');
var creditMinusButton = document.querySelector('.credit__value-button--minus');
var creditValueInput = document.querySelector('#credit__value');
var creditSum; // сумма кредита

// первоначальный взнос
var firstPaymentSlider = document.querySelector('#credit__first-payment-slider-input');
var firstPaymentInput = document.querySelector('#credit__first-payment-input');
var firstPaymentPercent = document.querySelector('#credit__first-payment-percent');

// срок кредита
var creditTimeInput = document.querySelector('#credit__time-input');
var creditTimeSlider = document.querySelector('#credit__time-slider-input');
var creditTimeText = document.querySelector('#credit__time-text');
var years; // срок ипотеки
var months; // количество месяцев за срок кредита

// предложение
var offerPercentRate = document.querySelector('#percent-rate');
var offerMonthPayment = document.querySelector('#month-payment');
var offerRequiredProfit = document.querySelector('#required-profit');
var offerCreditValue = document.querySelector('#offer-credit-value');

// остальное
var motherCapital = document.querySelector('#credit__mother-capital');
var percentRate; // начальное значение процентной ставки
var percentRateMonth; // процентная ставка в месяц
var monthPayment; // ежемесячный платеж
var requiredProfit; // требуемый доход

// увеличение и уменьшение суммы кредита по клику
creditPlusButton.addEventListener('click', function () {
  event.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) + HYPOTHEC_CREDIT_STEP;
});

creditMinusButton.addEventListener('click', function () {
  event.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) - HYPOTHEC_CREDIT_STEP;
});

// ??? параметры так же как и переменные именуются?
// функция переноса значения ползунка в текстовое поле
function getSliderToInput(sliderInput, inputField, sliderLabel, dimension) {
  sliderInput.addEventListener('input', function () {
    inputField.value = sliderInput.value;
    sliderLabel.innerHTML = sliderInput.value + dimension;
  });
}

// функция добавления в разметку значений по кредиту
function showOffer(element, value, dimension) {
  element.innerHTML = value + dimension;
}

// изменение срока кредита
getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');

// изменение первоначального взноса
// ??? здесь по идее тоже нужно использовать function getSliderToInput, но есть вычисления
firstPaymentSlider.addEventListener('input', function () {
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
  firstPaymentPercent.innerHTML = firstPaymentSlider.value + '%';
});

creditForm.addEventListener('input', function () {
  // изменение процентной ставки
  if (Number(firstPaymentSlider.value) < PERCENT_CHANGE_LIMIT) {
    percentRate = PERCENT_MAX;
  } else {
    percentRate = PERCENT_MIN;
  }

  if (motherCapital.checked) {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value) - MOTH_CAP;
  } else {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value);
  }

  years = creditTimeSlider.value;
  months = years * MONTHS_PER_YEAR;

  // вывод в HTML разметку полученных значений в раздел "Наше предложение"
  showOffer(offerPercentRate, percentRate, '%');


  showOffer(offerCreditValue, creditSum, ' рублей');

  percentRateMonth = percentRate * PERCENT_COEF / MONTHS_PER_YEAR;
  monthPayment = Math.trunc(creditSum * (percentRateMonth + percentRateMonth / (Math.pow((1 + percentRateMonth), months) - 1)));
  showOffer(offerMonthPayment, monthPayment, ' рублей');

  requiredProfit = Math.trunc(monthPayment / REQUIRED_PROFIT_RATIO);
  showOffer(offerRequiredProfit, requiredProfit, ' рублей');
});


