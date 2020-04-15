'use strict';
/* eslint-disable */
ymaps.ready(init);

var pins = [
  {
    coords: [55.753215, 37.622504],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Москва',
  },
  {
    coords: [59.939095, 30.315868],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Сантк-Петербург',
  },
  {
    coords: [51.533103, 46.034158],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Саратов',
  },
  {
    coords: [67.612056, 33.668228],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Кировск',
  },
  {
    coords: [57.153033, 65.534328],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Тюмень',
  }, {
    coords: [54.989342, 73.368212],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Россия',
    city: 'Омск',
  },
  {
    coords: [40.369539, 49.835011],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'СНГ',
    city: 'Баку',
  },
  {
    coords: [41.311151, 69.279737],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'СНГ',
    city: 'Ташкент',
  },
  {
    coords: [53.902512, 27.561481],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'СНГ',
    city: 'Минск',
  },
  {
    coords: [43.238293, 76.945465],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'СНГ',
    city: 'Алма-Аты',
  },
  {
    coords: [48.856663, 2.351556],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Европа',
    city: 'Париж',
  },
  {
    coords: [50.087640, 14.414376],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Европа',
    city: 'Прага',
  },
  {
    coords: [51.507351, -0.127660],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Европа',
    city: 'Лондон',
  },
  {
    coords: [41.902689, 12.496176],
    name: 'Liga bank',
    text: 'Отделение Банка №',
    region: 'Европа',
    city: 'Рим',
  },

];

var myMap;
// pins.forEach(function (item, index, array) {
//   console.log(index);
// });
function drawPins () {
  pins
    .slice()
    .filter(function () {
      return true;
    })
    .map(function (pin) {
      return new ymaps.Placemark(pin.coords, {
        hintContent: pin.name + ' ' + pin.city,
        balloonContent: pin.text,
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
        iconImageOffset: [-18, -40],
      });
    })
    .forEach(function (pin) {
      myMap.geoObjects
      .add(pin);
    })
}

function init() {
  // Создание карты.
  myMap = new ymaps.Map("map", {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    center: [55.76, 37.64],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 4,
    controls: []
  }),

    // // Создаём макет содержимого.
    // MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
    //   '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
    // ),
    drawPins ();
    // myPlacemark = new ymaps.Placemark([55.753215, 37.622504], {
    //   hintContent: 'Лига Банк',
    //   balloonContent: 'Отделение банка в г. Москва'
    // }, {
    //   // Опции.
    //   // Необходимо указать данный тип макета.
    //   iconLayout: 'default#image',
    //   // Своё изображение иконки метки.
    //   iconImageHref: 'img/location-icon.svg',
    //   // Размеры метки.
    //   iconImageSize: [35, 40],
    //   // Смещение левого верхнего угла иконки относительно
    //   // её "ножки" (точки привязки).
    //   iconImageOffset: [-17, -40],
    //   city: 'Москва',
    //   region: 'Россия',
    // });

  // myMap.geoObjects
  //   .add(myPlacemark);
    //.add(myPlacemarkWithContent);
};

// 4134: "zoomControl"
  // 4135: "searchControl"
  // 4139: "typeSelector"
  // 4142: "geolocationControl"
  // 4143: "fullscreenControl"
  // 4144: "trafficControl"
  // 4145: "rulerControl"


