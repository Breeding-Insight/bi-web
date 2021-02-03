<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="columns is-centered">
    <div class="card column is-half">
      <div class="card-content has-text-centered">
        <h1
            class="is-size-5 has-text-primary"
        >
          Welcome to Breeding Insight!
        </h1>
        <p>
          To activate your account, please log in.
        </p>
        <button
            id="connect-orcid-button"
            class="button orcidBtn"
            v-bind:class="{'is-loading': loginProcessing}"
            v-bind:disabled="loginProcessing"
            v-on:click="orcidLogin"
        >
          SIGN IN with ORCID
          <img
              id="orcid-id-icon"
              src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
              width="24"
              height="24"
              class="is-pulled-right"
              alt="ORCID iD icon"
          >
        </button>
        <p class="is-size-7 has-text-left">
          To acknowledge that you have used your iD and that it has been authenticated, we display
          the ORCID iD icon
          <img
              id="orcid-id-icon2"
              src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
              width="16"
              height="16"
              alt="ORCID iD icon"
          >
          alongside your name in our application. Learn more in
          <a href="">How should an ORCID iD be displayed</a>.
        </p>
      </div>
    </div>

    <ServerContactErrorModal
        v-bind:active.sync="isLoginServerErrorModalActive"
        v-on:deactivate="isLoginServerErrorModalActive = false"
    />
  </div>
</template>

<script lang="ts">
  import {Prop, Vue} from "vue-property-decorator";
  import Component from "vue-class-component";
  import {ServerManagementService} from "@/breeding-insight/service/ServerManagementService";
  import {UserService} from "@/breeding-insight/service/UserService";
  import ServerContactErrorModal from "@/components/modals/ServerContactErrorModal.vue";

  @Component({
    components: {ServerContactErrorModal}
  })
  export default class AccountSignUp extends Vue {
    public loginProcessing: boolean = false;
    public accountTokenCookieName: string = Vue.prototype.$cookieNames.accountToken;
    public isLoginServerErrorModalActive: boolean = false;
    @Prop()
    public accountToken: string | undefined;

    // Methods
    async orcidLogin() {

      // Check the server can be contacted
      this.loginProcessing = true;
      try {
        await ServerManagementService.checkHealth();
      } catch (error) {
        this.isLoginServerErrorModalActive = true;
        this.loginProcessing = false;
        return;
      }

      // Log them out of openid
      try {
        await UserService.openIdLogout();
      } catch (error) {
        Vue.$log.error(error);
      }

      // Set the cookie to pass back their account token. Timeout is an hour
      Vue.$cookies.set(this.accountTokenCookieName, this.accountToken, 60*60);

      // Start login process
      window.location.href = process.env.VUE_APP_BI_API_ROOT+'/sso/start';
    }
  }
</script>

<style scoped>

</style>