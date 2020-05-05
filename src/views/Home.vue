<template>
  <div class="userhome">
    <div class="is-divider"></div>
    <div class="columns">
      <div class="column is-three-fifths">
        <p class="title">Welcome, {{ activeUser.name }}!</p>
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
                <p class="title is-4">{{ activeUser.name }}</p>
                <p class="subtitle is-6">{{ activeUser.orcid }}</p>
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
  import { Component, Vue } from 'vue-property-decorator'
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";
  import {processProgramNavigation} from "@/router/guards";

  @Component({
    computed: {
      ...mapGetters([
        'activeUser'
      ])
    },
    beforeRouteUpdate: processProgramNavigation
  })
  export default class Home extends Vue {

    private activeUser: User | undefined;
  }
</script>