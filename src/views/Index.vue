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
    <div class="columns is-mobile">
      <img
        class="column is-2 is-offset-5"
        alt="Breeding Insight Logo"
        src="../assets/img/bi-logo.svg"
      >
    </div>
    <div class="is-divider" />
    <nav class="level">
      <p class="level-item has-text-centered">
        Combining genomics and informatics to accelerate genetic gains
      </p>
    </nav>
    <div class="is-divider" />
    <div class="columns">
      <div class="column is-three-fifths">
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <p>Part of a Breeding Insight program?</p>
          </div>
          <div class="column is-narrow">
            <b-button
              class="button is-primary"
              @click="isLoginModalActive = true"
            >
              LOG IN
            </b-button>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <p class="title is-5">
              Our current specialty breeding programs:
            </p>
          </div>
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">
                    BLUEBERRY
                  </p>
                </div>
                <div class="column">
                  <img
                    class="is-pulled-right"
                    alt="Blueberry Icon"
                    src="../assets/img/icon-blueberry.png"
                    style="height: 80px; "
                  >
                </div>
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">
                    SALMONIDS
                  </p>
                </div>
                <div class="column">
                  <img
                    class="is-pulled-right"
                    alt="Trout Icon"
                    src="../assets/img/icon-trout.png"
                    style="height: 60px; "
                  >
                </div>
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">
                    SWEET POTATO
                  </p>
                </div>
                <div class="column">
                  <img
                    class="is-pulled-right"
                    alt="Sweet Potato Icon"
                    src="../assets/img/icon-sweetpotato.png"
                    style="height: 60px; "
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box has-background-grey-lighter">
              <div class="column">
                <p class="title is-5">
                  ALFALFA
                </p>
              </div>
              <div class="column">
                <img
                  class="is-pulled-right"
                  alt="Alfalfa Icon"
                  src="../assets/img/icon-alfalfa.png"
                  style="height: 80px; "
                >
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="column">
                <p class="title is-5">
                  GRAPE
                </p>
              </div>
              <div class="column">
                <img
                  class="is-pulled-right"
                  alt="Grape Icon"
                  src="../assets/img/icon-grape.png"
                  style="height: 80px; "
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <h5 class="title is-5">
          Our Mission
        </h5>
        <p>
          By combining genomics with the powerful tools of informatics, breeding for genetic gain has undergone
          a revolution. But due to high-costs, some smaller breeding programs have been left behind. The mission
          of the Breeding Insight team is to make high-tech breeding a reality for smaller programs.
        </p>
        <br>
        <p>
          Breeding Insight is funded by the U.S. Department of Agriculture (USDA) Agricultural
          Research Service (ARS) through Cornell University. The USDA ARS delivers scientific solutions
          to national and global agricultural challenges. As a global leader in agricultural discovery through
          scientific excellence, ARS is committed to delivering cutting-edge, scientific tools and innovative
          solutions for American farmers, producers, industry, and communities to support the nourishment
          and well-being of all people; sustaining our nation’s agroecosystems and natural resources; and
          ensuring the economic competitiveness and excellence of our agriculture.
        </p>
      </div>
    </div>
    <BaseModal
      v-bind:active="isLoginModalActive"
      v-bind:body-class="'has-text-centered'"
      v-on:close-modal="isLoginModalActive = !isLoginModalActive"
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
        class="orcidBtn"
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

    <WarningModal
      v-bind:active.sync="isLoginServerErrorModalActive"
      v-bind:msg-title="'Server Error: Login Failed'"
      v-on:deactivate="isLoginServerErrorModalActive = false"
    >
      <section>
        <p class="has-text-dark">
          This application was unable to establish a connection with our servers. Please try again.
        </p>
        <p class="has-text-dark">
          If you continue to experience problems, try
          <a href="http://status.orcid.org/">checking the ORCID status page</a>.
          If all else fails,
          <a href="#!">contact Breeding Insight support</a>.
        </p>
      </section>
    </WarningModal>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseModal from '@/components/modals/BaseModal.vue'
  import InfoModal from '@/components/modals/InfoModal.vue'
  import WarningModal from '@/components/modals/WarningModal.vue'
  import {ServerManagementService} from "@/breeding-insight/service/ServerManagementService";
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";

  @Component({
    components: {InfoModal, BaseModal, WarningModal}
  })
  export default class Index extends Vue {

    public isLoginModalActive: boolean = false;
    public isLoginServerErrorModalActive: boolean = false;
    @Prop()
    public loginRedirect!: boolean;
    @Prop()
    public sessionExpired!: boolean;

    mounted() {
      if (this.loginRedirect || this.sessionExpired){
        this.isLoginModalActive = true;
      }
    }

    // Methods
    orcidLogin() {
      // Check the server can be contacted
      this.isLoginModalActive = false;
      ServerManagementService.checkHealth().then((response) => {
        window.location.href = process.env.VUE_APP_BI_API_ROOT+'/sso/start';
      }).catch((error) => {
        this.isLoginServerErrorModalActive = true;
      })
    }

  }
</script>

<style scoped lang="scss">

#connect-orcid-button{
	border: 1px solid #D3D3D3;
	padding: .3em;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 1px 1px 3px #999;
	cursor: pointer;
	color: #999;
	font-weight: bold;
	font-size: .8em;
	line-height: 24px;
	vertical-align: middle;
}

#connect-orcid-button:hover{
	border: 1px solid #338caf;
	color: #338caf;
}

#orcid-id-icon{
	display: block;
	margin: 0 .5em 0 .5em;
	padding: 0;
	float: left;
}
</style>