'use strict';

// процентная ставка
var PERCENT_MAX = 9.4;
var PERCENT_MIN = 8.5;
var PERCENT_CHANGE_LIMIT = 15; // значение, после которого меняется процентная ставка
var PERCENT_COEF = 0.01;
// при рефакторинге объектом сделать
var PERCENT_AUTO_HIGH = 16;
var PERCENT_AUTO_MIDDLE = 15;
var PERCENT_AUTO_LOW = 8.5;
var PERCENT_AUTO_LOWEST = 3.5;
var AUTOCREDIT_VALUE_LIMIT_PERCENT = 2000000;
var CONSUMER_VALUE_LIMIT_LOW = 750000;
var CONSUMER_VALUE_LIMIT_HIGH = 2000000;
var PERCENT_CONSUMER_HIGH = 15;
var PERCENT_CONSUMER_MIDDLE = 12.5;
var PERCENT_CONSUMER_LOW = 9.5;
var PERCENT_CONSUMER_DELTA = 0.5;

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
var creditParameters = document.querySelector('.credit__parameters');
var creditLabel = document.querySelector('#credit-label');
var creditLimitsLabel = document.querySelector('#credit-limits-label');
var creditOfferLabel = document.querySelector('.credit__offer-label');
var creditStep = CreditSettings.hypothec.CREDIT_STEP;


// кастомный select
var activeSelect = document.querySelector('.credit__select-active');
var selectList = document.querySelector('.credit__select-list');

// размер кредита
var creditForm = document.querySelector('#credit-form');
var creditPlusButton = document.querySelector('.credit__value-button--plus');
var creditMinusButton = document.querySelector('.credit__value-button--minus');
var creditValueInput = document.querySelector('#credit__value');
var creditSum = 0; // сумма кредита
var creditErrorText = document.querySelector('.credit__error-text');

// первоначальный взнос
var firstPaymentBlock = document.querySelector('.credit__first-payment-block');
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
var finalFormWrapper = document.querySelector('.final-form__input-wrapper');

// popup
var popup = document.querySelector('.popup');
var buttonClosePopup = document.querySelector('.popup__close-button');

// остальное
var motherCapital = document.querySelector('#credit__mother-capital');
var casco = document.querySelector('#credit__casco');
var creditInsurance = document.querySelector('#credit__insurance');
var salaryClient = document.querySelector('#credit__salary');
var percentRate; // начальное значение процентной ставки
var percentRateMonth; // процентная ставка в месяц
var monthPayment; // ежемесячный платеж
var requiredProfit; // требуемый доход

// подключение масок на input
/* eslint-disable */
jQuery(document).ready(function () {

  $(creditValueInput).mask('000 000 000 000 000,00 рублей', { reverse: true });
  $(firstPaymentInput).mask('000 000 000 000 000,00 рублей', { reverse: true });
  $(creditTimeInput).mask('000 лет', { reverse: true });

});

// накладывает денежную маску на элемент
function moneyMask(element) {
  $(element).unmask(); // внутренний метод плагина
  $(element).mask('000 000 000 000 000,00 рублей', { reverse: true });
}

function yearMask(element) {
  $(element).unmask(); // внутренний метод плагина
  $(element).mask('000 лет', { reverse: true });
}

function phoneMask(element) {
  $(element).unmask(); // внутренний метод плагина
  $(element).mask('+7 (000) 000-0000');
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
    setTimeout(closeSelect, 100);
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
  // сбрасывает все чекбоксы при переклбчении типа кредита
  uncheckingCheckboxes();
  // возвращает первоначальный взнос в минимальное значение
  firstPaymentSlider.value = CreditSettings[goal.value].CREDIT_PERCENT_MIN;
  firstPaymentInput.value = getUnmaskValue(creditValueInput) * firstPaymentSlider.value * PERCENT_COEF;
  firstPaymentPercent.textContent = firstPaymentSlider.value + '%';
  // пересчет количества лет, точнее надписей
  getSliderToInput(creditTimeSlider, creditTimeInput, creditTimeText, ' лет');
  reCalculate();
  // закрывате блок первого взноса при потребительском кредите
  if (goal.value === CreditSettings.consumer.CREDIT_GOAL) {
    firstPaymentBlock.classList.add('credit__first-payment-block--closed');
  } else {
    firstPaymentBlock.classList.remove('credit__first-payment-block--closed');
  }
  hideCheckboxes();
  showCheckboxes();
  changeSelectClass();
}

// сбрасывает все чекбоксы
function uncheckingCheckboxes() {
  var checkboxes = creditForm.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}

// скрывает все чекбоксы
function hideCheckboxes() {
  var checkboxBlocks = creditForm.querySelectorAll('.credit__checkbox');
  for (var i = 0; i < checkboxBlocks.length; i++) {
    checkboxBlocks[i].classList.add('closed');
  }
}
// показывает чекбоксы в зависимости от типа кредита
function showCheckboxes() {
  if (goal.value === CreditSettings.hypothec.CREDIT_GOAL) {
    document.querySelector('.credit__checkbox--mother-capital').classList.remove('closed');
  } else if (goal.value === CreditSettings.autocredit.CREDIT_GOAL) {
    document.querySelector('.credit__checkbox--casco').classList.remove('closed');
    document.querySelector('.credit__checkbox--insurance').classList.remove('closed');
  } else if (goal.value === CreditSettings.consumer.CREDIT_GOAL) {
    document.querySelector('.credit__checkbox--salary').classList.remove('closed');
  }
}

// переключает кастомный и настоящий select
function makeActiveItem() {
  selectList.addEventListener('click', function (evt) {
    activeSelect.textContent = evt.target.textContent;
    selectList.classList.add('credit__select-list--closed');
    goal.value = evt.target.dataset.value;

    onSelectItemChange();
    creditOfferBlock.classList.remove('closed');
    creditParameters.classList.remove('closed');
  });
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
    if (getUnmaskValue(creditTimeInput) < CreditSettings[goal.value].CREDIT_TIME_MIN) {
      creditTimeInput.value = CreditSettings[goal.value].CREDIT_TIME_MIN;
    } else if (getUnmaskValue(creditTimeInput) > CreditSettings[goal.value].CREDIT_TIME_MAX) {
      creditTimeInput.value = CreditSettings[goal.value].CREDIT_TIME_MAX;
    } else {
      creditTimeInput.value = getUnmaskValue(creditTimeInput);
    }
    creditTimeSlider.value = getUnmaskValue(creditTimeInput);
    yearMask(creditTimeInput);
    creditTimeText.textContent = creditTimeInput.value;
    reCalculate();
  });
}
// изменение первоначального взноса ползунком
function onFirstPaymentSlider() {
  firstPaymentSlider.addEventListener('input', function () {
    unmasking(creditValueInput);
    getSliderToInput(firstPaymentSlider, firstPaymentInput, firstPaymentPercent, '%');
    firstPaymentInput.value = creditValueInput.value * firstPaymentSlider.value * PERCENT_COEF;
  });
}

// позволяет вводить в инпут первого взноса значения и двигает слайдер
function onFirstPaymentInputChange() {
  firstPaymentInput.addEventListener('change', function () {
    unmasking(creditValueInput);
    unmasking(firstPaymentInput);
    firstPaymentSlider.value = firstPaymentInput.value / creditValueInput.value / PERCENT_COEF;
    firstPaymentPercent.textContent = firstPaymentSlider.value + '%';
    var firstPay = firstPaymentInput.value / creditValueInput.value / PERCENT_COEF;
    if (firstPay < CreditSettings[goal.value].CREDIT_PERCENT_MIN) {
      firstPaymentSlider.value = CreditSettings[goal.value].CREDIT_PERCENT_MIN;
      firstPaymentInput.value = firstPaymentSlider.value * creditValueInput.value * PERCENT_COEF;
    }

    moneyMask(creditValueInput);
    moneyMask(firstPaymentInput);
  });
}

creditValueInput.addEventListener('input', function () {
  unmasking(creditValueInput);
  unmasking(firstPaymentInput);
  firstPaymentInput.value = firstPaymentSlider.value * creditValueInput.value * PERCENT_COEF;
  moneyMask(creditValueInput);
  moneyMask(firstPaymentInput);
});
creditValueInput.addEventListener('change', function () {
  unmasking(creditValueInput);
  unmasking(firstPaymentInput);
  firstPaymentInput.value = firstPaymentSlider.value * creditValueInput.value * PERCENT_COEF;
  moneyMask(creditValueInput);
  moneyMask(firstPaymentInput);
});

// добавляет в разметку значения по кредиту
function showOffer(element, value, dimension) {
  element.textContent = value + dimension;
}

// пересчитывает значения в разделе "Наше предложение"
function reCalculate() {

  // делаем unmask всех элементов, которые используются в расчетах, в конце снова наложим маску на них
  unmasking(creditValueInput);
  unmasking(firstPaymentInput);

  if (motherCapital.checked) {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value) - MOTH_CAP;
  } else {
    creditSum = Number(creditValueInput.value) - Number(firstPaymentInput.value);
  }

  // изменение процентной ставки - вынести в функцию
  if (goal.value === 'hypothec') {
    if (Number(firstPaymentSlider.value) < PERCENT_CHANGE_LIMIT) {
      percentRate = PERCENT_MAX;
    } else {
      percentRate = PERCENT_MIN;
    }
  }

  if (goal.value === 'autocredit') {
    percentRate = PERCENT_AUTO_HIGH;
    if (creditValueInput.value >= AUTOCREDIT_VALUE_LIMIT_PERCENT) {
      percentRate = PERCENT_AUTO_MIDDLE;
    }

    if (casco.checked && creditInsurance.checked) {
      percentRate = PERCENT_AUTO_LOWEST;
    } else if (casco.checked || creditInsurance.checked) {
      percentRate = PERCENT_AUTO_LOW;
    }
  }

  if (goal.value === 'consumer') {
    if (creditValueInput.value < CONSUMER_VALUE_LIMIT_LOW) {
      percentRate = PERCENT_CONSUMER_HIGH;
    } else if (creditValueInput.value >= CONSUMER_VALUE_LIMIT_LOW && creditValueInput.value < CONSUMER_VALUE_LIMIT_HIGH) {
      percentRate = PERCENT_CONSUMER_MIDDLE;
    } else if (creditValueInput.value >= CONSUMER_VALUE_LIMIT_HIGH) {
      percentRate = PERCENT_CONSUMER_LOW;
    }

    if (salaryClient.checked === true) {
      percentRate = percentRate - PERCENT_CONSUMER_DELTA;
    }
  }

  showErrorCreditValue();
  showErrorBlock();

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
  requestNumber = Number(requestNumber) + 1;
  localStorage.setItem = ('requestNumber', Number(requestNumber) + 1);

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

// при маленькой сумме кредиты показывает сообщение об ошибке
function showErrorBlock() {
  if (creditSum < CreditSettings[goal.value].CREDIT_SUM_MIN) {
    errorHeader.textContent = CreditSettings[goal.value].CREDIT_ERROR_TEXT;
    errorBlock.classList.remove('closed');
    creditOfferBlock.classList.add('closed');
  } else {
    errorBlock.classList.add('closed');
    creditOfferBlock.classList.remove('closed');
  }
}
// при значении кредита вне допустимых пределов выдается ошибка
function showErrorCreditValue() {
  if (creditValueInput.value < CreditSettings[goal.value].CREDIT_VALUE_MIN || creditValueInput.value > CreditSettings[goal.value].CREDIT_VALUE_MAX) {
    creditValueInput.classList.add('credit__value-error');
    creditErrorText.classList.remove('credit__error-text--closed');
  } else {
    creditValueInput.classList.remove('credit__value-error');
    creditErrorText.classList.add('credit__error-text--closed');
  }
}

// popup
function popupHandler() {
  function closePopup() {
    popup.classList.add('popup--closed');
    document.body.classList.remove('body__container--popup-opened');
  }

  popup.addEventListener('click', function (evt) {
    if (evt.target === evt.currentTarget) {
      closePopup();
    }
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      if (!popup.classList.contains('popup--closed')) {
        closePopup();
      }
    }
  });

  buttonClosePopup.addEventListener('click', function () {
    closePopup();
  });

  // finalForm.addEventListener('submit', function (evt) {
  //   evt.preventDefault();
  //   popup.classList.remove('popup--closed');
  //   document.body.classList.add('body__container--popup-opened');
  // });
}
// удаляет класс тряски формы при ошибке
function deleteError() {
  finalFormWrapper.classList.remove('final-form__input-wrapper--error');
}

creditForm.addEventListener('input', reCalculate);

// увеличение и уменьшение суммы кредита по клику
creditPlusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(getUnmaskValue(creditValueInput)) + creditStep;
  firstPaymentInput.value = firstPaymentSlider.value * creditValueInput.value * PERCENT_COEF;
  reCalculate();
  moneyMask(creditValueInput);
});

creditMinusButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  creditValueInput.value = Number(getUnmaskValue(creditValueInput)) - creditStep;
  firstPaymentInput.value = firstPaymentSlider.value * creditValueInput.value * PERCENT_COEF;
  reCalculate();
  moneyMask(creditValueInput);
});

requestButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  finalForm.classList.remove('final-form--closed');
  changeFinalForm();
  finalFormUsername.focus();
});

// добавление в localStorage полей формы
finalForm.addEventListener('submit', function (evt) {
  evt.preventDefault();

  if (!finalFormUsername.value || !finalFormPhone.value || !finalFormEmail.value) {
    finalFormWrapper.classList.add('final-form__input-wrapper--error');
    setTimeout(deleteError, 1100);
  } else {
    localStorage.setItem = ('username', finalFormUsername.value);
    localStorage.setItem = ('phone', finalFormPhone.value);
    localStorage.setItem = ('email', finalFormEmail.value);
    popup.classList.remove('popup--closed');
    document.body.classList.add('body__container--popup-opened');
  }
});

onCustomSelect();
makeActiveItem();
onFirstPaymentInputChange();
onFirstPaymentSlider();
onCreditTimeSlider();
onCreditTimeInput();
popupHandler();
phoneMask(finalFormPhone);

