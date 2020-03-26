<template lang="pug">
  .login-block
    header
      h1
        | {{$t('welcomeTo')}}
        span  HYDRA.
        | onixmap
    button.login(@click="login") {{$t('loginWith')}} HYDRA passport
    footer {{$t('poweredBy')}} ONIX systems
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';


@Component({})
export default class LoginPage extends Vue {
  public login() {
    this.$gtag.event('Login', {
      event_category: 'Login/logout',
    });
    const crypto = require('crypto');
    /* The resulting string will be twice as long as the random bytes you generate;
    each byte encoded to hex is 2 characters. 20 bytes will be 40 characters of hex. */
    const state: string = crypto.randomBytes(20).toString('hex');
    const codeVerifier: string = crypto.randomBytes(64).toString('hex');
    const codeChallenge: string = crypto.createHash('sha256').update(codeVerifier).digest('base64')
        .replace(/=+$/, '').replace(/[+]/g, '-').replace(/[\/]/g, '_');
    localStorage.state = state;
    localStorage.codeVerifier = codeVerifier;

    const params = new URLSearchParams();
    params.append('client_id', 'kVWed0XDnLYkat1MCqp9Z');
    params.append('redirect_uri', window.location.protocol + '//' + window.location.host + '/callback');
    params.append('response_type', 'code');
    params.append('scope', 'openid offline_access profile hydra_passport_find_users hydra_system_employee');
    params.append('state', state);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
    params.append('prompt', 'consent');

    window.location.href = 'https://passport.hydra.office.onix.ua/v1/oidc-provider/auth?' + params.toString();
  }
}
</script>

<style scoped lang="scss">
  .login-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font: normal normal 16px Inter, sans-serif;
  }

  header {
    display: flex;
    justify-content: center;
    h1 {
      text-align: center;
      font-size: 36px;
      line-height: 44px;
      span {
        font-weight: bold;
      }
    }
  }

  .login {
    margin-top: 56px;
    padding: 15px 20px;
    font: normal 500 16px Inter, sans-serif;
    line-height: 19px;
    color: #FFFFFF;
    background: #0072FF;
    border-radius: 4px;
    outline: none;
    border: none;
    cursor: pointer;
  }

  footer {
    color: #8E9AB2;
    font-size: 14px;
    line-height: 17px;
    position: absolute;
    bottom: 15%;
    @media only screen and (max-height: 450px) {
      position: initial;
      margin: 25px;
    }
  }
</style>
