'use strict';
/* eslint-disable */
ymaps.ready(init);
function init() {
  // Создание карты.
  var myMap = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.76, 37.64],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 5,
    controls: []
  }),

    // Создаём макет содержимого.
    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
      '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
    ),

    myPlacemark = new ymaps.Placemark([55.753215, 37.622504], {
      hintContent: 'Лига Банк',
      balloonContent: 'Отделение банка в г. Москва'
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#image',
      // Своё изображение иконки метки.
      iconImageHref: 'img/location-icon.svg',
      // Размеры метки.
      iconImageSize: [35, 40],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-17, -40],
      city: 'Москва',
      region: 'Россия',
    });

  myMap.geoObjects
    .add(myPlacemark);
    //.add(myPlacemarkWithContent);
};

// 4134: "zoomControl"
  // 4135: "searchControl"
  // 4139: "typeSelector"
  // 4142: "geolocationControl"
  // 4143: "fullscreenControl"
  // 4144: "trafficControl"
  // 4145: "rulerControl"


