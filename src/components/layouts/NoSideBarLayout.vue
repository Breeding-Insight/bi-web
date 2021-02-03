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
    <header>
      <div class="level header-title is-marginless is-mobile">
        <div class="level-left">
          <div class="level-item">
            <a href="/">
              <img
                  src="../../assets/img/bi-logo.svg"
                  alt="Breeding Insight home"
                  width="232"
              >
            </a>
          </div>
        </div>
        <div class="level-right">
          <h1 class="title has-text-primary">{{title}}</h1>
        </div>
      </div>
    </header>
    <div class="columns is-marginless">
      <div class="column">
        <main>
          <div
            v-if="username"
            class="level is-mobile">
            <div class="level-left"></div>
            <div class="level-right">
              <div class="level-item">
                <p>Logged in as <strong>{{username}}</strong></p>
              </div>
              <div class="level-item">
                <button class="button is-outlined is-primary" @click="$emit('logout')">Log out</button>
              </div>
            </div>
          </div>
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

  @Component
  export default class NoSideBarLayout extends Vue {

    @Prop()
    username!: string;

    @Prop()
    title!: string;
  
  }

</script>