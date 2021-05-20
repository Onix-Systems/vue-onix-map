import axios from 'axios';
import router from '@/router';
import {vxm} from '@/store';

const baseDomain = process.env.VUE_APP_API_URL;
const baseURL = `${baseDomain}/v1/`;

const ax = axios.create({
  baseURL,
});

// Add a request interceptor
ax.interceptors.request.use((request) => {
  if (localStorage.token) {
    request.headers.Authorization = `${vxm.user.tokenType} ${vxm.user.token}`;
    return request;
  }
  return request;
});

// Add a response interceptor
ax.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, (error) => {
  if (process.env.VUE_APP_DEMO_MODE) {

    return;
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.response.status === 401) {
    router.push('/callback');
  }
});

export default ax;
