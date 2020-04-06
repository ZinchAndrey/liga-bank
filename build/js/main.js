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
    CREDIT_GOAL_RU: 'Ипотека',
    CREDIT_STEP: 100000,
    CREDIT_LABEL: 'Стоимость недвижимости',
    CREDIT_OFFER_LABEL: 'Сумма ипотеки',
    CREDIT_LIMITS: 'От 1 200 000 до 25 000 000 рублей',
    CREDIT_VALUE_MIN: 1200000,
    CREDIT_VALUE_MAX: 25000000,
    CREDIT_TIME_MIN: 5,
    CREDIT_TIME_MAX: 30,
    CREDIT_PERCENT_MIN: 10,
    CREDIT_PERCENT_MAX: 100,
    CREDIT_SUM_MIN: 500000,
    CREDIT_ERROR_TEXT: 'Наш банк не выдает ипотечные кредиты меньше 500 000 рублей',
  },
  autocredit: {
    CREDIT_GOAL: 'autocredit',
    CREDIT_GOAL_RU: 'Автокредит',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Стоимость автомобиля',
    CREDIT_OFFER_LABEL: 'Сумма автокредита',
    CREDIT_LIMITS: 'От 500 000 рублей до 5 000 000 рублей',
    CREDIT_VALUE_MIN: 500000,
    CREDIT_VALUE_MAX: 5000000,
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 5,
    CREDIT_PERCENT_MIN: 20,
    CREDIT_PERCENT_MAX: 100,
    CREDIT_SUM_MIN: 200000,
    CREDIT_ERROR_TEXT: 'Наш банк не выдает автокредиты меньше 200 000 рублей',
  },
  consumer: {
    CREDIT_GOAL: 'consumer',
    CREDIT_GOAL_RU: 'Потребительский кредит',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Сумма потребительского кредита',
    CREDIT_OFFER_LABEL: 'Сумма кредита',
    CREDIT_LIMITS: 'От 50 000 рублей до 3 000 000 рублей',
    CREDIT_VALUE_MIN: 50000,
    CREDIT_VALUE_MAX: 3000000,
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 7,
    CREDIT_PERCENT_MIN: 0,
    CREDIT_PERCENT_MAX: 0,
    CREDIT_SUM_MIN: 0,
    CREDIT_ERROR_TEXT: 'Наш банк не выдает ипотечные кредиты меньше 500 000 рублей',
  },
};

// цель кредита
var goal = document.querySelector('#goal');
var creditLabel = document.querySelector('#credit-label');
var creditLimitsLabel = document.querySelector('#credit-limits-label');
var creditOfferLabel = document.querySelector('.credit__offer-label');
var creditStep = CreditSettings.hypothec.CREDIT_STEP;
var firstPaymentBlock = document.querySelector('.credit__first-payment-block');

// кастомный select
var activeSelect = document.querySelector('.credit__select-active');
var selectList = document.querySelector('.credit__select-list');

// размер кредита
var creditForm = document.querySelector('#credit-form');
var creditPlusButton = document.querySelector('.credit__value-button--plus');
var creditMinusButton = document.querySelector('.credit__value-button--minus');
var creditValueInput = document.querySelector('#credit__value');
var creditSum = 0; // сумма кредита

// первоначальный взнос
var firstPaymentSlider = document.querySelector('#credit__first-payment-slider-input');
var firstPaymentInput = document.querySelector('#credit__first-payment-input');
var firstPaymentPercent = document.querySelector('#credit__first-payment-percent');

// срок кредита
var creditTimeInput = document.querySelector('#credit__time-input');
var creditTimeSlider = document.querySelector('#credit__time-slider-input');
var creditTimeText = document.querySelector('#credit__time-text');

// предложение
var offerPercentRate = document.querySelector('#percent-rate');
var offerMonthPayment = document.querySelector('#month-payment');
var offerRequiredProfit = document.querySelector('#required-profit');
var offerCreditValue = document.querySelector('#offer-credit-value');
var requestButton = document.querySelector('.credit__offer-button');
var creditOfferBlock = document.querySelector('.credit__offer');

// окно ошибки
var errorBlock = document.querySelector('.credit__error');
var errorHeader = document.querySelector('.credit__error-header');

// финальная форма - шаг 3
var finalForm = document.querySelector('.final-form');
var finalFormUsername = document.querySelector('[name=username]');
var finalFormPhone = document.querySelector('[name=phone]');
var finalFormEmail = document.querySelector('[name=mail]');
var requestNumber = 1; // начальное значение счетчика заявок

// остальное
var motherCapital = document.querySelector('#credit__mother-capital');
var percentRate; // начальное значение процентной ставки
var percentRateMonth; // процентная ставка в месяц
var monthPayment; // ежемесячный платеж
var requiredProfit; // требуемый доход

// подключение масок на input
/* eslint-disable */
jQuery(document).ready(function () {

  $(creditValueInput).mask('000 000 000 000 000 рублей', { reverse: true });
  $(firstPaymentInput).mask('000 000 000 000 000 рублей', { reverse: true });
  $(creditTimeInput).mask('000 лет', { reverse: true });

});

// накладывает денежную маску на элемент
function moneyMask(element) {
  $(element).unmask(); // внутренний метод плагина
  $(element).mask('000 000 000 000 000 рублей', { reverse: true });
}

function yearMask(element) {
  $(element).unmask(); // внутренний метод плагина
  $(element).mask('000 лет', { reverse: true });
}

// возвращает значение элемента без маски
function getUnmaskValue(element) {
  return $(element).cleanVal();
}
// снимает маску с элемента
function unmasking(element) {
  $(element).unmask();
}

/* eslint-enable */

// открывает и закрывает список кастомного select
function onCustomSelect() {
  activeSelect.addEventListener('click', function () {
    selectList.classList.toggle('credit__select-list--closed');
    activeSelect.textContent = 'Выберите цель кредита';
    changeSelectClass();

    // добавляет фокус на список кредитов
    selectList.focus();
    onBlurSelect();
  });
}

// закрывает список кастомного select при расфокусе, задержка по времени нужна, чтобы одновременно не срабатывал blur и click на activeSelect
function onBlurSelect() {
  selectList.addEventListener('blur', function () {
    setTimeout(closeSelect, 10);
  });
}

// закрывает выпадалющий список
function closeSelect() {
  if (selectList.classList.contains('credit__select-list--closed') === false) {
    selectList.classList.add('credit__select-list--closed');
    changeSelectClass();
  }
}

// меняет класс выбранного селекта <p> для корректного отображения рамок
function changeSelectClass() {
  if (selectList.classList.contains('credit__select-list--closed') === true) {
    activeSelect.classList.add('credit__select-active--closed');
  } else {
    activeSelect.classList.remove('credit__select-active--closed');
  }
}

// делает пересчет значений при выборе типа кредита
function onSelectItemChange() {
  changeLabels(goal.value); // evt.currentTarget = goal.value
  // возвращает первоначальный взнос в минимальное значение
  firstPaymentSlider.value = CreditSettings[goal.value].CREDIT_PERCENT_MIN;
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
  // пересчет количества лет, точнее надписей
  getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
  reCalculate();

  if (goal.value === CreditSettings.consumer.CREDIT_GOAL) {
    firstPaymentBlock.classList.add('credit__first-payment-block--closed');
  } else {
    firstPaymentBlock.classList.remove('credit__first-payment-block--closed');
  }
  changeSelectClass();
}

// переключает кастомный и настоящий select
function makeActiveItem() {
  selectList.addEventListener('click', function (evt) {
    activeSelect.textContent = evt.target.textContent;
    selectList.classList.add('credit__select-list--closed');
    goal.value = evt.target.dataset.value;

    onSelectItemChange();
  });
  // selectBlock.addEventListener('blur', function () {
  //   alert('test');
  // });
}

// переводит значение ползунка в связанный input
function getSliderToInput(sliderInput, inputField, sliderLabel, dimension) {
  inputField.value = sliderInput.value;
  sliderLabel.textContent = sliderInput.value + dimension;
}

// изменение срока кредита
function onCreditTimeSlider() {
  creditTimeSlider.addEventListener('input', function () {
    getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
  });
}

// функция по изменению input с количеством лет и переносу значений в ползунок
function onCreditTimeInput() {
  creditTimeInput.addEventListener('change', function () {
    creditTimeSlider.value = getUnmaskValue(creditTimeInput);

    if (getUnmaskValue(creditTimeInput) < CreditSettings[goal.value].CREDIT_TIME_MIN) {
      creditTimeInput.value = CreditSettings[goal.value].CREDIT_TIME_MIN;
    } else if (getUnmaskValue(creditTimeInput) > CreditSettings[goal.value].CREDIT_TIME_MAX) {
      creditTimeInput.value = CreditSettings[goal.value].CREDIT_TIME_MAX;
    }

    yearMask(creditTimeInput);
    creditTimeText.textContent = creditTimeInput.value;
    reCalculate();
  });
}

function onFirstPaymentSlider() {
  firstPaymentSlider.addEventListener('input', function () {
    unmasking(creditValueInput);
    getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
    firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
  });
}

function onFirstPaymentInput() {
  firstPaymentInput.addEventListener('change', function () {
    unmasking(creditValueInput);
    unmasking(firstPaymentInput);
    firstPaymentSlider.value = firstPaymentInput.value / creditValueInput.value / PERCENT_COEF;
    firstPaymentPercent.textContent = firstPaymentSlider.value + '%';

    moneyMask(creditValueInput);
    moneyMask(firstPaymentInput);
  });
}

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

  // делаем unmask всех элементов, которые используются в расчетах, в конце снова наложим маску на них
  unmasking(creditValueInput);
  unmasking(firstPaymentInput);

  // можно обернуть это в функции и использовать в обработчиках событий
  firstPaymentSlider.value = firstPaymentInput.value / creditValueInput.value / PERCENT_COEF;
  firstPaymentPercent.textContent = firstPaymentSlider.value + '%';

  getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
  // досюда

  if (motherCapital.checked) {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value) - MOTH_CAP;
  } else {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value);
  }

  // обернуть в функцию
  if (creditSum < CreditSettings[goal.value].CREDIT_SUM_MIN) {
    errorHeader.textContent = CreditSettings[goal.value].CREDIT_ERROR_TEXT;
    errorBlock.classList.remove('closed');
    creditOfferBlock.classList.add('closed');
  } else {
    errorBlock.classList.add('closed');
    creditOfferBlock.classList.remove('closed');
  }

  var years = creditTimeSlider.value;
  var months = years * MONTHS_PER_YEAR;

  // вывод в HTML разметку полученных значений в раздел "Наше предложение"
  showOffer(offerPercentRate, percentRate, '%');
  showOffer(offerCreditValue, creditSum, '');

  percentRateMonth = percentRate * PERCENT_COEF / MONTHS_PER_YEAR;
  monthPayment = Math.trunc(creditSum * (percentRateMonth + percentRateMonth / (Math.pow((1 + percentRateMonth), months) - 1)));
  showOffer(offerMonthPayment, monthPayment, '');

  requiredProfit = Math.trunc(monthPayment / REQUIRED_PROFIT_RATIO);
  showOffer(offerRequiredProfit, requiredProfit, '');

  // наложение масок
  moneyMask(creditValueInput);
  moneyMask(firstPaymentInput);
  moneyMask(offerCreditValue);
  moneyMask(offerMonthPayment);
  moneyMask(offerRequiredProfit);
  yearMask(creditTimeInput);
}

// меняет подписи в зависимости от типа кредита
function changeLabels(creditType) {
  creditLabel.textContent = CreditSettings[creditType].CREDIT_LABEL;
  creditLimitsLabel.textContent = CreditSettings[creditType].CREDIT_LIMITS;
  creditStep = CreditSettings[creditType].CREDIT_STEP;
  creditOfferLabel.textContent = CreditSettings[creditType].CREDIT_OFFER_LABEL;

  // установка атрибутов ползунка срока кредита
  creditTimeSlider.setAttribute('min', CreditSettings[creditType].CREDIT_TIME_MIN);
  creditTimeSlider.setAttribute('max', CreditSettings[creditType].CREDIT_TIME_MAX);
  creditTimeSlider.setAttribute('value', CreditSettings[creditType].CREDIT_TIME_MIN);
  creditTimeSlider.value = CreditSettings[creditType].CREDIT_TIME_MIN;

  // установка атрибутов ползунка с процентами
  firstPaymentSlider.setAttribute('min', CreditSettings[creditType].CREDIT_PERCENT_MIN);
  firstPaymentSlider.setAttribute('max', CreditSettings[creditType].CREDIT_PERCENT_MAX);
  firstPaymentSlider.setAttribute('value', CreditSettings[creditType].CREDIT_PERCENT_MIN);
  firstPaymentSlider.value = CreditSettings[creditType].CREDIT_PERCENT_MIN;
}

// меняет поля в блоке шаг 3
function changeFinalForm() {
  var finalFormCreditType = document.querySelector('#final-form__credit-type');
  var finalFormCreditValue = document.querySelector('#final-form__credit-value');
  var finalFormFirstPayment = document.querySelector('#final-form__first-payment');
  var finalFormCreditTime = document.querySelector('#final-form__credit-time');
  var finalFormCreditLabel = document.querySelector('#final-form__credit-label');
  var finalFormFirstPaymentBlock = document.querySelector('.final-form__item--first-payment');
  var finalFormRequestNumber = document.querySelector('#credit-request-number');
  var requestNumberText = '0000' + Number(requestNumber);

  // local storage
  localStorage.setItem('requestNumber', Number(requestNumber) + 1);
  requestNumber = localStorage.getItem('requestNumber');

  finalFormCreditType.textContent = CreditSettings[goal.value].CREDIT_GOAL_RU;
  finalFormCreditValue.textContent = creditValueInput.value;
  finalFormFirstPayment.textContent = firstPaymentInput.value;
  finalFormCreditTime.textContent = creditTimeInput.value;
  finalFormCreditLabel.textContent = CreditSettings[goal.value].CREDIT_LABEL;
  finalFormRequestNumber.textContent = '№ ' + requestNumberText.slice(-4);

  if (goal.value === 'consumer') {
    finalFormFirstPaymentBlock.classList.add('final-form__item--closed');
  } else {
    finalFormFirstPaymentBlock.classList.remove('final-form__item--closed');
  }
}

creditForm.addEventListener('input', reCalculate);

// увеличение и уменьшение суммы кредита по клику
creditPlusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(getUnmaskValue(creditValueInput)) + creditStep;
  reCalculate();
  moneyMask(creditValueInput);
});

creditMinusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(getUnmaskValue(creditValueInput)) - creditStep;
  reCalculate();
  moneyMask(creditValueInput);
});

requestButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  finalForm.classList.remove('final-form--closed');
  changeFinalForm();
});

// добавление в localStorage полей формы
finalForm.addEventListener('submit', function () {
  localStorage.setItem = ('username', finalFormUsername.value);
  localStorage.setItem = ('phone', finalFormPhone.value);
  localStorage.setItem = ('email', finalFormEmail.value);
});

// creditOfferBlock.addEventListener('change', function () {
//   if (creditSum < 1200000) {
//     console.log('test');
//     // errorBlock.classList.remove('closed');
//   }
// });

// creditValueInput.addEventListener('input', function () {
//   if (getUnmaskValue(creditValueInput) < 1200000) {
//     creditValueInput.validity.valid = false;
//     creditValueInput.setCustomValidity('Введите значение из диапазона');
//     console.log('test');

//   }
// });

onCustomSelect();
makeActiveItem();
onFirstPaymentInput();
onFirstPaymentSlider();
onCreditTimeSlider();
onCreditTimeInput();


