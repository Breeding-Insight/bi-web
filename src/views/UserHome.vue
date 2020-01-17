<template>
  <div class="userhome">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <img alt="Breeding Insight Logo" src="../assets/img/bi-logo.svg" style="height: 100px;">
        </div>
      </div>
      <div class="level-right">
        <div class="level-item has-text-right">
          <p class="title">Program Name</p>
        </div>
      </div>
    </nav>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <b-button @click="logout">LOG OUT</b-button>
          </div>
        </div>
      </div>
    </nav>
    <div class="is-divider"></div>
    <div class="columns">
      <div class="column is-three-fifths">
        <p class="title">Welcome, {{ username }}!</p>
        <div class="columns is-mobile">
          <div class="column">
            <p class="title is-6">Last activity:</p>
             <div class="columns is-mobile">
               <div class="column is-narrow">
                  <p>Data entry for trial Y4-03-10</p>
               </div>
               <div class="column is-narrow">
                 <b-button class="button is-primary">RESUME</b-button>
               </div>
             </div>
          </div>
          <div class="column">
            <p class="title is-6">Most common tasks:</p>
            <p>Inventory</p>
            <p>Trial Y4--02-10</p>
            <p>Trial Y4-01-01</p>
            <p>Experiments</p>
          </div>
        </div>

        <div class="columns is-mobile">
          <div class="column">
            <p class="title is-6">Program Activity Log</p>
            <p>Username | Type of activity here, data changed, etc. | 2019-12-12 4:08pm</p>
            <p>Username | Type of activity here, data changed, etc. | 2019-12-12 4:08pm</p>
            <p>Username | Type of activity here, data changed, etc. | 2019-12-12 4:08pm</p>
            <p>Username | Type of activity here, data changed, etc. | 2019-12-12 4:08pm</p>
            <p>Username | Type of activity here, data changed, etc. | 2019-12-12 4:08pm</p>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ username }}</p>
                <p class="subtitle is-6">{{ orcid }}</p>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <a href="#" class="card-footer-item">Edit</a>
          </footer>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import { LOGOUT } from '@/store/mutation-types';
  import * as api from '@/util/api';
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component
  export default class UserHome extends Vue {

    // Computed properties
    get username(): string {
      return this.$store.state.user ? this.$store.state.user.name : '';
    }

    get orcid(): boolean {
      return this.$store.state.user ? this.$store.state.user.id : '';
    }

    // Methods
    logout(): void {
      window.location.href = process.env.VUE_APP_BI_API_ROOT+'/logout'
    }
  }
</script>