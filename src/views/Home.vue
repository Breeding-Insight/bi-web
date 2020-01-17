<template>
  <div class="home">
    <div class="columns is-mobile">
      <img class="column is-2 is-offset-5" alt="Breeding Insight Logo" src="../assets/img/bi-logo.svg">
    </div>
    <div class="is-divider"></div>
    <nav class="level">
      <p class="level-item has-text-centered">Combining genomics and informatics to accelerate genetic gains</p>
    </nav>
    <div class="is-divider"></div>
    <div class="columns">
      <div class="column is-three-fifths">
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <p>Part of a Breeding Insight program?</p>
          </div>
          <div class="column is-narrow">
            <b-button class="button is-primary" @click="isLoginModalActive = true">LOG IN</b-button>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column is-narrow">
            <p class="title is-5">Our current specialty breeding programs:</p>
          </div>
        </div>

        <div class="tile is-ancestor">
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">BLUEBERRY</p>
                </div>
                <div class="column">
                  <img class="is-pulled-right" alt="Blueberry Icon" src="../assets/img/icon-blueberry.png" style="height: 80px; ">
                </div>
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">SALMONIDS</p>
                </div>
                <div class="column">
                  <img class="is-pulled-right" alt="Trout Icon" src="../assets/img/icon-trout.png" style="height: 60px; ">
                </div>
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="columns is-mobile">
                <div class="column">
                  <p class="title is-5">SWEET POTATO</p>
                </div>
                <div class="column">
                  <img class="is-pulled-right" alt="Sweet Potato Icon" src="../assets/img/icon-sweetpotato.png" style="height: 60px; ">
                </div>
              </div>
            </div>
          </div>
          <div class="tile is-4 is-vertical is-parent">
            <div class="tile is-child box has-background-grey-lighter">
              <div class="column">
                <p class="title is-5">ALFALFA</p>
              </div>
              <div class="column">
                <img class="is-pulled-right" alt="Alfalfa Icon" src="../assets/img/icon-alfalfa.png" style="height: 80px; ">
              </div>
            </div>
            <div class="tile is-child box has-background-grey-lighter">
              <div class="column">
                <p class="title is-5">GRAPE</p>
              </div>
              <div class="column">
                <img class="is-pulled-right" alt="Grape Icon" src="../assets/img/icon-grape.png" style="height: 80px; ">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <h5 class="title is-5">Our Mission</h5>
          <p>By combining genomics with the powerful tools of informatics, breeding for genetic gain has undergone a revolution. But due to high-costs, some smaller breeding programs have been left behind. The mission of the Breeding Insight team is to make high-tech breeding a reality for smaller programs.</p>
          <br>
          <p>Breeding Insight is funded by the U.S. Department of Agriculture (USDA) Agricultural Research Service (ARS) through Cornell University. The USDA ARS delivers scientific solutions to national and global agricultural challenges. As a global leader in agricultural discovery through scientific excellence, ARS is committed to delivering cutting-edge, scientific tools and innovative solutions for American farmers, producers, industry, and communities to support the nourishment and well-being of all people; sustaining our nation’s agroecosystems and natural resources; and ensuring the economic competitiveness and excellence of our agriculture.</p>
      </div>
    </div>
    <b-modal :active.sync="isLoginModalActive">
      <div class="modal-card" style="width: auto">
        <!-- <header class="modal-card-head">
            <p class="modal-card-title">Login</p>
        </header> -->
        <section class="modal-card-body has-text-centered">
          <p class>Breeding Insight uses ORCID to confirm your identification.</p>
          <br>
          <b-button id="connect-orcid-button" @click="orcidLogin">
            <img id="orcid-id-icon" src="https://orcid.org/sites/default/files/images/orcid_24x24.png" width="24" height="24" alt="ORCID iD icon"/>
            Register or Connect your ORCID iD
          </b-button>
        </section>
      </div>
    </b-modal>

    <!-- Login Failed Modal -->
    <b-modal :active.sync="isFailedLoginModalActive">
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body has-text-centered">
          <p class="is-size-1 has-text-danger">Login Failed</p>
          <p>We were not able to log you in successfully. Contact a system admin for assistance.</p>
        </section>
      </div>
    </b-modal>

    <!-- Login Failed Server Error Modal -->
    <b-modal :active.sync="isLoginServerErrorModalActive">
      <div class="modal-card" style="width: auto">
        <section class="modal-card-body has-text-centered">
          <p class="is-size-1 has-text-danger">Server Error: Login Failed</p>
          <p>We were not able to log you into the system because of an issue with our server.</p>
        </section>
      </div>
    </b-modal>
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

  import { LOGOUT } from '@/store/mutation-types';
  import * as api from '@/util/api';
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class Home extends Vue {

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
      return (this.$store.state.loginFailed && newLogin && this.$store.state.loginServerError);
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
	margin: 0 .5em 0 0;
	padding: 0;
	float: left;
}
</style>