<template>
  <div class="auth">
    <b-form @submit.stop.prevent="submit" @reset="reset">
      <b-card no-body :header="$t('authentication.title')">
        <b-card-body>
          <p>{{ $t('authentication.description') }}</p>
          <Description v-if="description" :description="description" />
          <b-form-input class="mb-2 mt-2" type="username" v-model.trim="username" autofocus :required="required" />
          <b-form-input class="mb-2 mt-2" type="password" v-model.trim="password" autofocus :required="required" />
        </b-card-body>
        <b-card-footer>
          <b-button type="submit" variant="primary">{{ $t('submit') }}</b-button>
          <b-button type="reset" variant="danger" class="ml-3">{{ $t('cancel') }}</b-button>
        </b-card-footer>
      </b-card>
    </b-form>
  </div>
</template>

<script>
import Description from './Description.vue';
import { BForm, BFormInput } from 'bootstrap-vue';
import { mapState } from 'vuex';
import config from '../../config'


import { userService } from '../services';

export default {
  name: 'Authentication',
  components: {
    BForm,
    BFormInput,
    Description
  },
  data() {
    return {
      username: '',
      password: '',
      submitted: false,
      error: '',
      token: '',
      required: true
    };
  },
  computed: {
    ...mapState(['authConfig', 'authData']),
    description() {
      if (this.authConfig.description) {
        return this.authConfig.description;
      }
      return this.$t('authConfig.description');
    }
  },
  created() {
    if (this.authData) {
      this.token = this.authData;
      this.required = false;
    }
  },
  methods: {
    reset() {
      this.$store.commit('requestAuth', null);
    },
    async submit() {
      const authResult = await this.login(this.username, this.password);
      if (authResult) {
        await this.$store.dispatch('setAuth', this.token);
        await this.$store.dispatch('retryAfterAuth');
        this.$store.commit('requestAuth', null);
      }
    },
    async login(username, password) {
        const request = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               'username': username,
               'password': password 
              })
        }

        const response = await fetch(`${config.authUrl}`, request);
        const accessToken = await this.handleResponse(response);
        //< If login successful - response payload contains access token
        if (accessToken) {
          this.token = accessToken;
          return true;
        }
        return false;
    },
    handleResponse(response) {
      return response.text().then(text => {

          if (!response.ok) {
              const error = (data && data.message) || response.statusText;
              return Promise.reject(error);
          }

          return text;
      });
    }
  }
};
</script>

<style lang="scss">
@import '../theme/variables.scss';

#stac-browser {
  .auth {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0,0,0, 0.5);
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    > form {
      min-width: 200px;
      width: 50vw;
      border-radius: $border-radius;

      > .card {
        background-color: #fff;
      }
    }
  }
}
</style>