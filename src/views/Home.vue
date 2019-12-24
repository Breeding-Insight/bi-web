<template>
  <div class="home">
    <div class="columns is-mobile">
      <img class="column is-2 is-offset-5" alt="Breeding Insight Logo" src="../assets/img/bi-logo.svg">
    </div>
    <nav class="level">
      <p class="level-item has-text-centered">Combining genomics and informatics to accelerate genetic gains</p>
    </nav>
    <div class="columns">
      <div class="column">
        <p>Part of a Breeding Insight program?</p>
        <b-button class="button is-primary" @click="isLoginModalActive = true">LOG IN</b-button>
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
          <section class="modal-card-body">
            <p>Breeding Insight uses ORCID to confirm your identification.</p>
            <br>
            <b-button id="connect-orcid-button" @click="orcidLogin">
              <img id="orcid-id-icon" src="https://orcid.org/sites/default/files/images/orcid_24x24.png" width="24" height="24" alt="ORCID iD icon"/>
              Register or Connect your ORCID iD
            </b-button>

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
  name: 'home',
  components: {
    HelloWorld
  }
}
</script> -->

<script>
  export default {
    data() {
      return {
        isLoginModalActive: false,
      }
    },
    methods: {
      orcidLogin() {
        window.open("https://sandbox.orcid.org/oauth/authorize?client_id=[YOUR CLIENT ID]response_type=code&scope=/authenticate&show_login=false&redirect_uri=https://yourwebsite.edu/RedirectURI", "_blank", "toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500");
      }
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