!--
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
  <div class="sidebarlayout">
  <!-- the redundant sidebarlayout div here fixes the vertical height issue, don't remove -->
    <BaseSideBarLayout v-bind:show-menu-toggle="false" v-bind:show-menu="sandboxConfig !== ''">
      <template v-slot:title>
        <div class="level-item">
          <b-button
          class="button is-primary"
          @click="isLoginModalActive = true"
          >
            LOG IN
          </b-button>
        </div>
      </template>
      <template v-slot:menu>
        <div v-if="sandboxConfig === ''" class="pl-3">
          <h1
            class="title has-text-warning is-5"
          >
            Developer mode
          </h1>
          <p class="has-text-light is-paddingless">
            For now, this message should only show up if there is no sandbox mode set.
          </p>
        </div>
        <div v-if="sandboxConfig === SandboxMode.Coordinator" class="pl-3">
          <h1
            class="title has-text-warning is-5"
          >
            Coordinator Mode
          </h1>
          <p class="has-text-light is-paddingless">
            Use your <span class="has-text-weight-bold">ORCID sandbox</span> login to access this site.
          </p>
        </div>
        <div v-if="sandboxConfig === SandboxMode.Public" class="pl-3">
          <h1
            class="title has-text-warning is-5"
          >
            Guest Account
          </h1>
          <p class="has-text-light is-paddingless">
            Use these credentials to explore sample data and currently available features.
          </p>
          <div class="is-hidden-touch">
            <hr class="is-light">
            <div class="columns is-gapless">
              <div class="column is-narrow mr-2">
                <b-button
                  class="button is-primary"
                  @click="isLoginModalActive = true"
                >
                  LOG IN
                </b-button>
              </div>
              <div class="column">
                <p class="is-paddingless is-marginless has-text-light is-size-7">
                  using the supplied guest account
                </p>
              </div>
            </div>
          </div> <!-- end login -->
          <hr class="is-light">

          <article class="block">
            <h2 class="has-text-warning is-5 is-normal">
              Guest
            </h2>
            <p class="has-text-light is-paddingless is-marginless">
              user: guestusr@mailinator.com
            </p>
            <p class="has-text-light is-paddingless">
              password: guestusr1
            </p>
          </article>
        </div>
      </template>
      <template v-slot:content>
        <slot />
      </template>
    </BaseSideBarLayout>
    <BaseModal
        v-bind:active="isLoginModalActive"
        v-bind:body-class="'has-text-centered'"
        v-on:deactivate="isLoginModalActive = false"
      >
        <h1
          v-if="loginRedirect"
          class="is-size-5 has-text-primary"
        >
          You must be logged in to view the resource you have requested.
        </h1>
        <h1
          v-else-if="sessionExpired"
          class="is-size-5 has-text-primary"
        >
          Your session has expired. Please login again to continue.
        </h1>
        <h1
          v-else-if="loginError"
          class="is-size-5 has-text-primary"
        >
          An error has occurred during login. Please try again.
        </h1>
        <h1
          v-else
          class="is-size-5 has-text-primary"
        >
          Welcome back to DeltaBreed!
        </h1>
        <p>
          To access to your breeding program, please log in.
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
              v-bind:src="orcidLogoUrl"
              v-on:error="setAltImg"
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
            v-bind:src="orcidLogoUrl"
            v-on:error="setAltImg"
            width="16"
            height="16"
            alt="ORCID iD icon"
          >
          alongside your name in our application. Learn more in
          <a href="">How should an ORCID iD be displayed</a>.
        </p>
      </BaseModal>

      <ServerContactErrorModal
          v-bind:active.sync="isLoginServerErrorModalActive"
          v-on:deactivate="isLoginServerErrorModalActive = false"
      />
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';
  import BaseModal from '@/components/modals/BaseModal.vue';
  import InfoModal from '@/components/modals/InfoModal.vue';
  import {ServerManagementService} from "@/breeding-insight/service/ServerManagementService";
  import {UserService} from "@/breeding-insight/service/UserService";
  import ServerContactErrorModal from "@/components/modals/ServerContactErrorModal.vue";
  import {SandboxMode} from '@/util/config';

@Component( {
    components: {BaseSideBarLayout, BaseModal, ServerContactErrorModal}
  })
  export default class InfoSideBarLayout extends Vue {

    sideMenuShownMobile: boolean = true;
    public isLoginModalActive: boolean = false;
    public isLoginServerErrorModalActive: boolean = false;
    public loginProcessing: boolean = false;
    private orcidLogoUrl: string = 'https://orcid.org/sites/default/files/images/orcid_24x24.png';
    @Prop()
    public loginRedirect!: boolean;
    @Prop()
    public sessionExpired!: boolean;
    @Prop()
    public loginError!: boolean;
    @Prop()
    username!: string;
    SandboxMode = SandboxMode;

    mounted() {
      if (this.loginRedirect || this.sessionExpired || this.loginError){
        this.isLoginModalActive = true;
      }
    }

    // Methods
    setAltImg() {
      this.orcidLogoUrl = require('@/assets/img/orcid_24x24.png');
    }
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

      // Start login process
      window.location.href = process.env.VUE_APP_BI_API_ROOT+'/sso/start';
    }

    get sandboxConfig() {
      return process.env.VUE_APP_SANDBOX;
    }

    }
</script>
