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
  <div class="sidebarlayout">
    <header class="main-header">
      <div class="level header-title is-marginless is-mobile">
        <div class="level-left">
          <div class="level-item">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="DeltaBreed home"
                  width="160"
              >
            </a>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <h1 class="title has-text-primary level-item">{{title}}</h1>
          </div>
          <div class="level-item">
            <UserStatusMenu v-bind:username="username" v-on:logout="$emit('logout')"/>
          </div>
        </div>
      </div>
    </header>
    <div class="columns is-marginless">
      <div class="column">
        <main id="main">
          <section class="section">
            <slot></slot>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import UserStatusMenu from "@/components/layouts/menus/UserStatusMenu.vue";

  @Component({
    components: {UserStatusMenu}
  })
  export default class NoSideBarLayout extends Vue {

    @Prop()
    username!: string;

    @Prop()
    title!: string;
  
  }

</script>