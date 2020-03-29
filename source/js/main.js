'use strict';

// процентная ставка
var PERCENT_MAX = 9.4;
var PERCENT_MIN = 8.5;
var PERCENT_CHANGE_LIMIT = 15; // значение, после которого меняется процентная ставка
var PERCENT_COEF = 0.01;

// остальное
var MONTHS_PER_YEAR = 12;
var REQUIRED_PROFIT_RATIO = 0.45;
var MOTH_CAP = 470000;

var CreditSettings = {
  hypothec: {
    CREDIT_GOAL: 'hypothec',
    CREDIT_STEP: 100000,
    CREDIT_LABEL: 'Стоимость недвижимости',
    CREDIT_LIMITS: 'От 1 200 000 до 25 000 000 рублей',
    CREDIT_TIME_MIN: 5,
    CREDIT_TIME_MAX: 30,
    CREDIT_PERCENT_MIN: 10,
    CREDIT_PERCENT_MAX: 100,
  },
  autocredit: {
    CREDIT_GOAL: 'autocredit',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Стоимость автомобиля',
    CREDIT_LIMITS: 'От 500 000 рублей до 5 000 000 рублей',
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 5,
    CREDIT_PERCENT_MIN: 20,
    CREDIT_PERCENT_MAX: 100,
  },
  consumer: {
    CREDIT_GOAL: 'consumer',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Сумма потребительского кредита',
    CREDIT_LIMITS: 'От 50 000 рублей до 3 000 000 рублей',
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 7,
    CREDIT_PERCENT_MIN: 0,
    CREDIT_PERCENT_MAX: 0,
  },
};

// шаг кредита
var CreditStep = {
  HYPOTHEC: 100000,
  AUTOCREDIT: 50000,
  CONSUMER: 50000
};

// цели кредита
var CreditGoal = {
  HYPOTHEC: 'hypothec',
  AUTOCREDIT: 'autocredit',
  CONSUMER: 'consumer'
};

// подписи
var CretidLabel = {
  HYPOTHEC: 'Стоимость недвижимости',
  AUTOCREDIT: 'Стоимость автомобиля',
  CONSUMER: 'Сумма потребительского кредита'
};

var CreditLimits = {
  HYPOTHEC: 'От 1 200 000 до 25 000 000 рублей',
  AUTOCREDIT: 'От 500 000 рублей до 5 000 000 рублей',
  CONSUMER: 'От 50 000 рублей до 3 000 000 рублей'
};

// временные рамки
var CreditTimeMin = {
  HYPOTHEC: 5,
  AUTOCREDIT: 1,
  CONSUMER: 1
};

var CreditTimeMax = {
  HYPOTHEC: 30,
  AUTOCREDIT: 5,
  CONSUMER: 7
};

// пределы по процентам
var CreditPercentMin = {
  HYPOTHEC: 10,
  AUTOCREDIT: 20,
  CONSUMER: 0
};

var CreditPercentMax = {
  HYPOTHEC: 100,
  AUTOCREDIT: 100,
  CONSUMER: 0
};

// цель кредита
var goal = document.querySelector('#goal');
var creditLabel = document.querySelector('#credit-label');
var creditLimitsLabel = document.querySelector('#credit-limits-label');
var creditStep = CreditSettings.hypothec.CREDIT_STEP;
var firstPaymentBlock = document.querySelector('.credit__first-payment-block');

function changeLabels(creditType) {
  creditLabel.textContent = CretidLabel[creditType];
  creditLimitsLabel.textContent = CreditLimits[creditType];
  creditStep = CreditStep[creditType];

  // установка атрибутов ползунка срока кредита
  creditTimeSlider.setAttribute('min', CreditTimeMin[creditType]);
  creditTimeSlider.setAttribute('max', CreditTimeMax[creditType]);
  creditTimeSlider.setAttribute('value', CreditTimeMin[creditType]);
  creditTimeSlider.value = CreditTimeMin[creditType];

  // установка атрибутов ползунка с процентами
  firstPaymentSlider.setAttribute('min', CreditPercentMin[creditType]);
  firstPaymentSlider.setAttribute('max', CreditPercentMax[creditType]);
  firstPaymentSlider.value = CreditPercentMin[creditType];
  getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
}

goal.addEventListener('change', function (evt) {
  changeLabels(evt.currentTarget.value.toUpperCase()); // evt.currentTarget = goal.value

  if (goal.value === CreditGoal['CONSUMER']) {
    firstPaymentBlock.classList.add('credit__first-payment-block--closed');
  } else {
    firstPaymentBlock.classList.remove('credit__first-payment-block--closed');
  }
});

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
// var years; // срок ипотеки
// var months; // количество месяцев за срок кредита

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

// добавляет в разметку значения по кредиту
function showOffer(element, value, dimension) {
  element.textContent = value + dimension;
}

// пересчитывает значения в разделе "Наше предложение"
function reCalculate() {
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

  var years = creditTimeSlider.value;
  var months = years * MONTHS_PER_YEAR;

  // вывод в HTML разметку полученных значений в раздел "Наше предложение"
  showOffer(offerPercentRate, percentRate, '%');
  showOffer(offerCreditValue, creditSum, ' рублей');

  percentRateMonth = percentRate * PERCENT_COEF / MONTHS_PER_YEAR;
  monthPayment = Math.trunc(creditSum * (percentRateMonth + percentRateMonth / (Math.pow((1 + percentRateMonth), months) - 1)));
  showOffer(offerMonthPayment, monthPayment, ' рублей');

  requiredProfit = Math.trunc(monthPayment / REQUIRED_PROFIT_RATIO);
  showOffer(offerRequiredProfit, requiredProfit, ' рублей');
}

// переводит значение ползунка в связанный input
function getSliderToInput(sliderInput, inputField, sliderLabel, dimension) {
  inputField.value = sliderInput.value;
  sliderLabel.textContent = sliderInput.value + dimension;
}


creditForm.addEventListener('input', reCalculate);

// увеличение и уменьшение суммы кредита по клику
creditPlusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) + creditStep;
  reCalculate();
});

creditMinusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) - creditStep;
  reCalculate();
});

// изменение срока кредита
creditTimeSlider.addEventListener('input', function () {
  getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
});

// изменение первоначального взноса
firstPaymentSlider.addEventListener('input', function () {
  getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
});
