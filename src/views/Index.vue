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
      <h1 class="is-size-5 has-text-primary">
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

    <!-- Login Failed Modal -->
    <InfoModal
        v-bind:active.sync="isFailedLoginModalActive"
        v-on:deactivate="isFailedLoginModalActive = false"
        v-bind:msg-title="'Login Failed'"
    >
      <p class="has-text-dark">
        Verify your login credentials, and if the issue persists
        <a href="#!">contact your breeding program leader</a> or
        <a href="#!">Breeding Insight support</a>.
      </p>
    </InfoModal>

    <WarningModal
        v-bind:active.sync="isLoginServerErrorModalActive"
        v-bind:msg-title="'Server Error: Login Failed'"
        v-on:deactivate="isLoginServerErrorModalActive = false"
    >
      <section>
        <p class="has-text-dark">
          This applications was unable to establish a connection with ORCID. Please try again.
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

  <!-- <div class="home">
    <img alt="Breeding Insight Logo" src="../assets/img/bi-logo.svg">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div> -->
</template>


<!-- <script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script> -->

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import BaseModal from '@/components/modals/BaseModal.vue'
  import InfoModal from '@/components/modals/InfoModal.vue'
  import WarningModal from '@/components/modals/WarningModal.vue'

  @Component({
    components: {InfoModal, BaseModal, WarningModal}
  })
  export default class Index extends Vue {

    public isLoginModalActive: boolean = false;

    // Computed properties
    get isFailedLoginModalActive(): boolean {
      // If the user just attempted login, and they are unauthorized for userinfo, warn them
      const newLogin = this.$route.query['new-login'] == 'true';
      return (this.$store.state.loginFailed && newLogin && !this.$store.state.loginServerError);
    }

    get isLoginServerErrorModalActive(): boolean {
      // If the user just tried to log in, and there was an error with the endpoint, warn them. 
      const newLogin = this.$route.query['new-login'] == 'true';
      return (!this.$store.state.loginFailed && newLogin && this.$store.state.loginServerError);
    }

    set isFailedLoginModalActive(disable: boolean) {
      this.$store.dispatch('clearLoginFailed');
    }

    set isLoginServerErrorModalActive(disable: boolean) {
      this.$store.dispatch('clearLoginFailed');
    }

    // Methods
    orcidLogin() {
      window.location.href = process.env.VUE_APP_BI_API_ROOT+'/sso/start';
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