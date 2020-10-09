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
  <div class="is-full-length">
    <header class="container">
      <div>
        <nav
          class="navbar"
          role="navigation"
          aria-label="main navigation"
        >
          <div class="navbar-menu">
            <ul class="navbar-start">
              <li class="navbar-item">
                <router-link to="/">
                  Home
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/about">
                  About
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/style-guide">
                  Style Guide
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/user-management">
                  Manage Users
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/program-management">
                  Program Management
                </router-link>
              </li>
              <li v-if="activeUser" class="navbar-item">
                <a @click="$emit('logout')">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <main>
      <section class="section">
        <slot></slot>
      </section>
    </main>

  </div>

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import {mapGetters} from "vuex";
  import {User} from "@/breeding-insight/model/User";

  @Component({
    computed: {
      ...mapGetters([
        'activeUser'
      ])
    },
  })
  export default class SimpleLayout extends Vue {
    private activeUser?: User;
  }

</script>