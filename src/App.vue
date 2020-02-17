<template>
  <div id="app">
    <div style="position:fixed;top:1px;z-index:9999;left:1px;right:1px;">
      <SuccessNotification ref="successNotification" class="is-marginless"></SuccessNotification>
      <ErrorNotification ref="errorNotification" class="is-marginless"></ErrorNotification>
      <InfoNotification ref="infoNotification" class="is-marginless"></InfoNotification>
    </div>
    
    <header class="container">
      <div v-if="loggedIn">
          <nav class="navbar" role="navigation" aria-label="main navigation">
              <div class="navbar-menu">
                  <ul class="navbar-start">
                      <li class="navbar-item"><router-link to="/">Home</router-link></li>
                      <li class="navbar-item"><router-link to="/about">About</router-link></li>
                      <li class="navbar-item"><router-link to="/styleguide">Style Guide</router-link></li>
                      <li class="navbar-item"><router-link to="/usermanagement">Manage Users</router-link></li>
                      <li class="navbar-item"><router-link to="/program-management">Program Management</router-link></li>
                      <li class="navbar-item"><a v-on:click="logOut">Logout</a></li>
                  </ul>
              </div>
          </nav>
      </div>
    </header>
    <main class="container">
      <router-view 
          @show-success-notification="showSuccessNotification"
          @show-info-notification="showInfoNotification"
          @show-error-notification="showErrorNotification"
      />
    </main>
    <footer class="footer">
      <div class="level">
        <nav>
          <div class="level-left">
            <div class="level-item">
              <a href="/">Terms of Use</a>
            </div>
            <div class="level-item">
              <a href="/">Privacy Policy</a>
            </div>
            <div class="level-item">
              <a href="/">Contact Us</a>
            </div>
            <div class="level-item">
              <a href="/">About</a>
            </div>
          </div>
        </nav>
        
        <div class="level-right">

          <div class="level-item">
            <p class="has-text-right">
            <strong>&copy; 2020 Breeding Insight</strong>
            <br>
            Funded by the USDA through Cornell University
            </p>
          </div>
          <div class="level-item">
            <img 
            src="./assets/img/usda.svg" 
            alt="USDA Logo" 
            width="75" 
            >
          </div>
          <div class="level-item">
            <img 
            src="./assets/img/cornell_seal.svg" 
            alt="Cornell University Logo" 
            width="56" 
            >
          </div>
          
        </div>
      </div>
    </footer>
      
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SuccessNotification from "@/components/notifications/SuccessNotification.vue"
import InfoNotification from "@/components/notifications/InfoNotification.vue"
import ErrorNotification from "@/components/notifications/ErrorNotification.vue"

@Component({
  watch: {
      $route(to, from) {
          document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
      },
      loggedIn(isLoggedIn) {
          if(!isLoggedIn) {
              this.$router.push('/');
          }             
      }
  }, 
  components: {SuccessNotification, InfoNotification, ErrorNotification}, 
})
export default class App extends Vue {
  public loading: boolean = false;

  public $refs!: {
    successNotification: SuccessNotification,
    infoNotification: InfoNotification, 
    errorNotification: ErrorNotification
  };

  get loggedIn () {
    return this.$store.state.loggedIn;
  }

  get requestedPath () {
    return this.$store.state.requestedPath;
  }

  logOut (): void {
    window.location.href = process.env.VUE_APP_BI_API_ROOT+'/logout';
  }

  showSuccessNotification(msg: string) {
    this.$refs.successNotification.active = true;
    this.$refs.successNotification.msg = msg;
  }

  showInfoNotification(msg: string) {
    this.$refs.infoNotification.active = true;
    this.$refs.infoNotification.msg = msg;
  }

  showErrorNotification(msg: string) {
    this.$refs.errorNotification.active = true;
    this.$refs.errorNotification.msg = msg;
  }
}
</script>
