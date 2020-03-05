import axios from 'axios';

const baseURL = 'https://onix-systems-map-backend.staging.onix.ua/';

const ax = axios.create({
  baseURL,
});
export default ax;
