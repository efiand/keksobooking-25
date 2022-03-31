import { DEFAULT_LOCATION, COORD_DECIMALS } from './data.js';

const ZOOM = 12;
const PIN_SIZE = 52;
const MAIN_PIN_SIZE = 52;
const PIN_RATIO = 0.5;
const LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const LAYER_COPY = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const map = L.map('map-canvas');

const setPin = (size, filename) => L.icon({
  iconUrl: `./img/${filename}.svg`,
  iconSize: [size, size],
  iconAnchor: [size * PIN_RATIO, size],
});

const mainPinMarker = L.marker(DEFAULT_LOCATION, {
  draggable: true,
  icon: setPin(MAIN_PIN_SIZE, 'main-pin'),
});

const getLocationString = ({ lat, lng }) => `${lat.toFixed(COORD_DECIMALS)}, ${lng.toFixed(COORD_DECIMALS)}`;

const createMarker = (createTemplate) => (item) => {
  L
    .marker(item.location, {
      icon: setPin(PIN_SIZE, 'pin')
    })
    .addTo(map)
    .bindPopup(createTemplate(item));
};

const addMapHandlers = (addressElement) => {
  mainPinMarker.on('moveend', (evt) => {
    addressElement.value = getLocationString(evt.target.getLatLng());
  });

  return () => {
    mainPinMarker.setLatLng(DEFAULT_LOCATION);
    map.closePopup().setView(DEFAULT_LOCATION, ZOOM);
  };
};

const initMap = (data, createBaloon, loadHandler) => {
  data.forEach(createMarker(createBaloon));

  map.on('load', loadHandler).setView(DEFAULT_LOCATION, ZOOM);
};

L.tileLayer(LAYER_URL, { attribution: LAYER_COPY }).addTo(map);
mainPinMarker.addTo(map);

export { initMap, addMapHandlers };