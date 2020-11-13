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
  <div class="home">
    <div class="columns">
      <div class="column side-menu is-2"> <!-- guest logins -->
        <aside role="complementary">
          <h1 class="title has-text-warning is-5">Guest Accounts</h1>
          <p class="has-text-light is-paddingless">Use these credentials to explore sample data and currently available features.</p>
          <hr class="is-light" />
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
              <p class="is-paddingless is-marginless has-text-light is-size-7">using one of the supplied guest accounts</p>
            </div>
          </div> <!-- end login -->
          <hr class="is-light" />

          <article>
            <h2 class="has-text-warning is-5 is-normal">Alfalfa Guest</h2>
            <p class="has-text-light is-paddingless is-marginless">user: alfalfa@mailinator.com</p>
            <p class="has-text-light is-paddingless">password: alfalfa1</p>
          </article>
          <article>
            <h2 class="has-text-warning is-5 is-normal">Blueberry Guest</h2>
            <p class="has-text-light is-paddingless is-marginless">user: blueberry@mailinator.com</p>
            <p class="has-text-light is-paddingless">password: blueberry1</p>
          </article>
          <article>
            <h2 class="has-text-warning is-5 is-normal">Grape Guest</h2>
            <p class="has-text-light is-paddingless is-marginless">user: grape@mailinator.com</p>
            <p class="has-text-light is-paddingless">password: grape--1</p>
          </article>
          <article>
            <h2 class="has-text-warning is-5 is-normal">Salmonids Guest</h2>
            <p class="has-text-light is-paddingless is-marginless">user: salmonid@mailinator.com</p>
            <p class="has-text-light is-paddingless">password: salmonid1</p>
          </article>
          <article>
            <h2 class="has-text-warning is-5 is-normal">Sweetpotato Guest</h2>
            <p class="has-text-light is-paddingless is-marginless">user: sweetpotato@mailinator.com</p>
            <p class="has-text-light is-paddingless">password: sweetpotato1</p>
          </article>
        </aside>
      </div> <!-- end guest logins -->
      <div class="column">
        <div class="columns is-multiline is-align-items-stretch"> <!-- primary content -->
          <article class="column">
            <div class="card" style="height:100%">
              <div class="card-image">
                <figure class="image">
                  <img src="../assets/img/sand.jpg" />
                </figure>
              </div>
              <div class="card-content">
              <h1 class="title has-text-primary is-4">About the sandbox</h1>
              <p>This site is a demo of current development for Breeding Insight's data management software. You can use one of the provided guest accounts to explore sample data.</p>
              <p class="has-text-weight-bold">Please note:</p>
              <ul>
                <li>All submitted data are public; do not submit private data.</li>
                <li>The database is routinely reset and submitted data may be removed without notice.</li>
              </ul>
              <p>We encourage you to share your experiences using the sandbox with us!</p>
              <p class="is-centered"><a class="button is-primary">Send feedback to our team</a></p>
          </div>
        </div>
          </article>
          <article class="column">
            <div class="card" style="height:100%">
              <div class="card-image">
                <figure class="image">
                  <img src="../assets/img/logo-banner.png" />
                </figure>
              </div>
              <div class="card-content">
                <h1 class="title has-text-primary is-4">About Breeding Insight</h1>
                <p>We provide scientific consultation and data management software to the specialty crop and animal breeding communities.</p>
                <ul>
                  <li>Genomics</li>
                  <li>Phenomics</li>
                  <li>Data Management</li>
                  <li>Software Tools</li>
                  <li>Analysis</li>
                </ul>
                <p>Breeding Insight is funded by the U.S. Department of Agriculture (USDA) Agricultural Research Service (ARS) through Cornell University.</p>
              </div>
            </div>
          </article>
          <article class="column">
            <div class="card" style="height:100%">
              <div class="card-image">
                <figure class="image">
                  <img src="../assets/img/species-collage.jpg" />
                </figure>
              </div>
              <div class="card-content">
              <h1 class="title has-text-primary is-4">Our breeding collaborators</h1>
              <p>The USDA Agricultural Research Service (ARS) supports breeding programs for approximately 90 specialty species.</p>
              <p>Breeding Insight is currently working with six species:</p>
              <ul>
                <li>Alfalfa</li>
                <li>Blueberry</li>
                <li>Table Grape</li>
                <li>Atlantic Salmon</li>
                <li>Rainbow Trout</li>
                <li>Sweetpotato</li>
              </ul>
              <p>Learn more about our projects for each species at <a href="https://www.breedinginsight.org">www.breedinginsight.org</a>.</p>
            </div>
          </div>
          </article>
        </div> <!-- end primary content -->
      </div>
    </div> <!-- end columns -->
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
        Welcome back to Breeding Insight!
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
    </BaseModal>

    <ServerContactErrorModal
        v-bind:active.sync="isLoginServerErrorModalActive"
        v-on:deactivate="isLoginServerErrorModalActive = false"
    />

  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseModal from '@/components/modals/BaseModal.vue'
  import InfoModal from '@/components/modals/InfoModal.vue'
  import {ServerManagementService} from "@/breeding-insight/service/ServerManagementService";
  import {UserService} from "@/breeding-insight/service/UserService";
  import ServerContactErrorModal from "@/components/modals/ServerContactErrorModal.vue";

  @Component({
    components: {ServerContactErrorModal, InfoModal, BaseModal}
  })
  export default class Index extends Vue {

    public isLoginModalActive: boolean = false;
    public isLoginServerErrorModalActive: boolean = false;
    public loginProcessing: boolean = false;
    @Prop()
    public loginRedirect!: boolean;
    @Prop()
    public sessionExpired!: boolean;
    @Prop()
    public loginError!: boolean;

    mounted() {
      if (this.loginRedirect || this.sessionExpired || this.loginError){
        this.isLoginModalActive = true;
      }
    }

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

      // Start login process
      window.location.href = process.env.VUE_APP_BI_API_ROOT+'/sso/start';
    }

  }
</script>
