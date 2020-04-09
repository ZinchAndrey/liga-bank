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
    zoom: 7,
    controls: []
  });

  // 4134: "zoomControl"
  // 4135: "searchControl"
  // 4139: "typeSelector"
  // 4142: "geolocationControl"
  // 4143: "fullscreenControl"
  // 4144: "trafficControl"
  // 4145: "rulerControl"
}


