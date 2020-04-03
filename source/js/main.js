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
    CREDIT_TIME_MIN: 5,
    CREDIT_TIME_MAX: 30,
    CREDIT_PERCENT_MIN: 10,
    CREDIT_PERCENT_MAX: 100,
  },
  autocredit: {
    CREDIT_GOAL: 'autocredit',
    CREDIT_GOAL_RU: 'Автокредит',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Стоимость автомобиля',
    CREDIT_OFFER_LABEL: 'Сумма автокредита',
    CREDIT_LIMITS: 'От 500 000 рублей до 5 000 000 рублей',
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 5,
    CREDIT_PERCENT_MIN: 20,
    CREDIT_PERCENT_MAX: 100,
  },
  consumer: {
    CREDIT_GOAL: 'consumer',
    CREDIT_GOAL_RU: 'Потребительский кредит',
    CREDIT_STEP: 50000,
    CREDIT_LABEL: 'Сумма потребительского кредита',
    CREDIT_OFFER_LABEL: 'Сумма кредита',
    CREDIT_LIMITS: 'От 50 000 рублей до 3 000 000 рублей',
    CREDIT_TIME_MIN: 1,
    CREDIT_TIME_MAX: 7,
    CREDIT_PERCENT_MIN: 0,
    CREDIT_PERCENT_MAX: 0,
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
// var selectBlock = document.querySelector('.credit__select-block');
var activeSelect = document.querySelector('.credit__select-active');
var selectList = document.querySelector('.credit__select-list');
// var selectItems = document.querySelectorAll('.credit__select-item');

// размер кредита
var creditForm = document.querySelector('#credit-form');
var creditPlusButton = document.querySelector('.credit__value-button--plus');
var creditMinusButton = document.querySelector('.credit__value-button--minus');
var creditValueInput = document.querySelector('#credit__value');
var creditSum; // сумма кредита


// var im = new Inputmask("999 999 999");
// im.mask(creditValueInput);
// Inputmask.extendAliases({
//   'numeric': {
//     autoUnmask: true,
//   }
// });
 Inputmask({"mask": "# ##9", removeMaskOnSubmit:true}).mask(creditValueInput);
// Inputmask("9-a{1,3}9{1,3}").mask(creditValueInput);
// Inputmask("9", { repeat: 10 }).mask(creditValueInput);

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

// закрывает список кастомного select при расфокусе
function onBlurSelect() {
  selectList.addEventListener('blur', function () {
    if (selectList.classList.contains('credit__select-list--closed') === false) {
      selectList.classList.add('credit__select-list--closed');
      changeSelectClass();
    }
  });
}
// поместить в onCustomSelect
// onBlurSelect();

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
function onInputCreditTime() {
  creditTimeSlider.addEventListener('input', function () {
    getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
  });
}

// изменение первоначального взноса
function onInputFirstPayment() {
  firstPaymentSlider.addEventListener('input', function () {
    getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
    firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
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

  // пересчет значений в слайдере
  getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
  getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;

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
  finalFormCreditValue.textContent = creditValueInput.value + ' рублей';
  finalFormFirstPayment.textContent = firstPaymentInput.value + ' рублей';
  finalFormCreditTime.textContent = creditTimeInput.value + ' лет';
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
  creditValueInput.value = Number(creditValueInput.value) + creditStep;
  reCalculate();
});

creditMinusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(creditValueInput.value) - creditStep;
  reCalculate();
});

firstPaymentSlider.addEventListener('input', function () {
  getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
  firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
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

onCustomSelect();
makeActiveItem();
onInputFirstPayment();
onInputCreditTime();


