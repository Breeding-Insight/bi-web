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
  <div class="userhome">
    <div class="is-divider"></div>
    <div class="columns">
      <div class="column is-three-fifths">
        <p class="title">Welcome, {{ activeUser.name }}!</p>
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
<!--          <footer class="card-footer">-->
<!--            <a href="#" class="card-footer-item">Edit</a>-->
<!--          </footer>-->
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";
  import ProgramsBase from "@/components/program/ProgramsBase.vue";

  @Component({
    computed: {
      ...mapGetters([
        'activeUser'
      ])
    },
  })
  export default class Home extends ProgramsBase {
    private activeUser?: User;
  }
</script>