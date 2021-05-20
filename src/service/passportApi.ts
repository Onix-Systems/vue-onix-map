import api from '@/service/api';

export default {
  getUsersPassportData() {
    return api.get(
      `${process.env.VUE_APP_PASSPORT_API_URL}/v1/api/users?perPage=10000&where={"isActive":"true"}`
    );
  },
  getCurrentUser() {
    return api.get(`${process.env.VUE_APP_PASSPORT_API_URL}/v1/oidc-provider/me`);
  },
}