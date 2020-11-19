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
  <div class="columns is-multiline is-align-items-stretch mt-4">
    <article class="column">
      <div
        class="card"
        style="height:100%"
      >
        <div
          class="card-image"
        >
          <figure class="image">
            <img
              src="../assets/img/sand.jpg"
              alt="closeup of sand"
              role="presentation"
            >
          </figure>
        </div>
        <div class="card-content">
          <h1 class="title has-text-primary is-4">
            About the sandbox
          </h1>
          <p>This site is a demo of current development for Breeding Insight's data management software. You can use one of the provided guest accounts to explore sample data.</p>
          <p class="has-text-weight-bold">
            Please note:
          </p>
          <ul>
            <li>All submitted data are public; do not submit private data.</li>
            <li>The database is routinely reset and submitted data may be removed without notice.</li>
          </ul>
          <p>We encourage you to share your experiences using the sandbox with us!</p>
          <p class="has-text-centered">
            <a class="button is-primary">
              Send feedback to our team
            </a>
          </p>
        </div>
      </div>
    </article>
    <article class="column">
      <div
        class="card"
        style="height:100%"
      >
        <div class="card-image">
          <figure class="image">
            <img
              src="../assets/img/logo-banner.png"
              alt="Breeding Insight banner"
              role="presentation"
            >
          </figure>
        </div>
        <div class="card-content">
          <h1 class="title has-text-primary is-4">
            About Breeding Insight
          </h1>
          <p>
            We provide scientific consultation and data management software to the specialty crop and animal breeding communities.
          </p>
          <ul>
            <li>Genomics</li>
            <li>Phenomics</li>
            <li>Data Management</li>
            <li>Software Tools</li>
            <li>Analysis</li>
          </ul>
          <p>
            Breeding Insight is funded by the U.S. Department of Agriculture (USDA) Agricultural Research Service (ARS) through Cornell University.
          </p>
        </div>
      </div>
    </article>
    <article class="column">
      <div
        class="card"
        style="height:100%"
      >
        <div class="card-image">
          <figure class="image">
            <img
              src="../assets/img/species-collage.jpg"
              alt="images of various species"
              role="presentation"
            >
          </figure>
        </div>
        <div class="card-content">
          <h1 class="title has-text-primary is-4">
            Our breeding collaborators
          </h1>
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
