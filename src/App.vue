<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <div id="app" class="has-navbar-fixed-top-touch">
    <div style="position:fixed;top:1px;z-index:9999;left:1px;right:1px;">
      <SuccessNotification ref="successNotification" class="is-marginless"></SuccessNotification>
      <ErrorNotification ref="errorNotification" class="is-marginless"></ErrorNotification>
      <InfoNotification ref="infoNotification" class="is-marginless"></InfoNotification>
    </div>
    
    <component v-bind:is="layout" v-bind:username="username" v-bind:title="layoutTitle" @logout="logOut">
        <router-view
            @show-success-notification="showSuccessNotification"
            @show-info-notification="showInfoNotification"
            @show-error-notification="showErrorNotification"
        />
    </component>

    <footer class="footer">
      <div class="level">
        <div class="level-left">
          <nav class="level-item">
            <div class="level">
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
        </div>

        <div class="level-right">

          <div class="level-item">
            <p class="has-text-right is-hidden-touch">
              <strong>&copy; 2020 Breeding Insight</strong>
              <br>
              Funded by the USDA through Cornell University
            </p>
            <p class="has-text-centered is-hidden-desktop">
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
import { Component, Vue } from 'vue-property-decorator'
import SuccessNotification from '@/components/notifications/SuccessNotification.vue'
import InfoNotification from '@/components/notifications/InfoNotification.vue'
import ErrorNotification from '@/components/notifications/ErrorNotification.vue'
import SimpleLayout from '@/components/layouts/SimpleLayout.vue'
import UserSideBarLayout from './components/layouts/UserSideBarLayout.vue'
import NoSideBarLayout from './components/layouts/NoSideBarLayout.vue'

@Component({
  watch: {
      $route(to, from) {
          document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
      },
      loggedIn(isLoggedIn) {
          if(!isLoggedIn) {
              this.$router.push('/');
          }             
      },
  },
  computed: {
    layout() {
      return this.$route.meta.layout ? `${this.$route.meta.layout}Layout` : 'simpleLayout';
    },
    layoutTitle() {
      return this.$route.meta.title;
    }
  },
  components: {
    SuccessNotification,
    InfoNotification,
    ErrorNotification,
    simpleLayout: SimpleLayout,
    userSideBarLayout: UserSideBarLayout,
    noSideBarLayout: NoSideBarLayout
  }
})
export default class App extends Vue {
  public loading: boolean = false;
  public t: string = "Title";

  public $refs!: {
    successNotification: SuccessNotification,
    infoNotification: InfoNotification, 
    errorNotification: ErrorNotification
  };

  get loggedIn () {
    return this.$store.state.loggedIn;
  }

  get username(): string {
    return this.$store.state.user ? this.$store.state.user.name : '';
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
