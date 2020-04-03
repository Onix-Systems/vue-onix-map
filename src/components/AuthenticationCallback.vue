<template lang="pug">
  .background
    the-loader
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import TheLoader from '@/components/TheLoader.vue';
import axios from 'axios';
import {store} from '@/store';

const ax = axios.create({
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
});

@Component({
  components: {TheLoader},
})
export default class AuthenticationCallback extends Vue {
  public created() {
    if (localStorage.token) {
      this.refresh();
    } else {
      this.callback();
    }
  }

  public callback() {
    const code = this.$route.query.code as string;
    const state = this.$route.query.state as string;
    if (!localStorage.codeVerifier || !code ||
      !state || state !== localStorage.state
    ) {
      this.$router.push('login');
      return;
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', process.env.VUE_APP_CLIENT_ID);
    params.append('redirect_uri', window.location.protocol + '//' + window.location.host + '/callback');
    params.append('code_verifier', localStorage.codeVerifier);
    params.append('code', code);
    this.getRequest(params);
}

  public refresh() {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', process.env.VUE_APP_CLIENT_ID);
    params.append('code_verifier', localStorage.codeVerifier);
    params.append('refresh_token', JSON.parse(localStorage.token).refresh_token);
    this.getRequest(params);
  }

  public getRequest(params: URLSearchParams) {
    ax.post(`${process.env.VUE_APP_PASSPORT_API_URL}/v1/oidc-provider/token`, params).then((res) => {
      localStorage.token = JSON.stringify(res.data);
      store.commit('setTokenType', res.data.token_type);
      store.commit('setToken', res.data.access_token);
      this.$router.push('/');
    }).catch((e) => {
      localStorage.removeItem('token');
      this.$router.push('/login');
    });
  }
}
</script>

<style lang="scss" scoped>
  .background {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #E5F0FF;
  }
</style>
