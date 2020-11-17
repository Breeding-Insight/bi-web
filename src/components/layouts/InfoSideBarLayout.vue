!--
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
  <BaseSideBarLayout>
    <template v-slot:title>
      <div class="level-item">
        <b-button
        class="button is-primary"
        @click="isLoginModalActive = true"
        >
          LOG IN
        </b-button>
      </div>
    </template>
    <template v-slot:menu>
      <div class="pl-3">
        <h1
          class="title has-text-warning is-5"
        >
          Guest Accounts
        </h1>
        <p class="has-text-light is-paddingless">
          Use these credentials to explore sample data and currently available features.
        </p>
        <div class="is-hidden-touch">
          <hr class="is-light">
          <div class="columns is-gapless">
            <div class="column is-narrow mr-2">
              <b-button
                class="button is-primary"
                @click="isLoginModalActive = true"
              >
                LOG IN
              </b-button>
            </div>
            <div class="column">
              <p class="is-paddingless is-marginless has-text-light is-size-7">
                using one of the supplied guest accounts
              </p>
            </div>
          </div>
        </div> <!-- end login -->
        <hr class="is-light">

        <article class="block">
          <h2 class="has-text-warning is-5 is-normal">
            Alfalfa Guest
          </h2>
          <p class="has-text-light is-paddingless is-marginless">
            user: alfalfa@mailinator.com
          </p>
          <p class="has-text-light is-paddingless">
            password: alfalfa1
          </p>
        </article>
        <article class="block">
          <h2 class="has-text-warning is-5 is-normal">
            Blueberry Guest
          </h2>
          <p class="has-text-light is-paddingless is-marginless">
            user: blueberry@mailinator.com
          </p>
          <p class="has-text-light is-paddingless">
            password: blueberry1
          </p>
        </article>
        <article class="block">
          <h2 class="has-text-warning is-5 is-normal">
            Grape Guest
          </h2>
          <p class="has-text-light is-paddingless is-marginless">
            user: grape@mailinator.com
          </p>
          <p class="has-text-light is-paddingless">
            password: grape--1
          </p>
        </article>
        <article class="block">
          <h2 class="has-text-warning is-5 is-normal">
            Salmonids Guest
          </h2>
          <p class="has-text-light is-paddingless is-marginless">
            user: salmonid@mailinator.com
          </p>
          <p class="has-text-light is-paddingless">
            password: salmonid1
          </p>
        </article>
        <article class="block">
          <h2 class="has-text-warning is-5 is-normal">
            Sweetpotato Guest
          </h2>
          <p class="has-text-light is-paddingless is-marginless">
            user: sweetpotato@mailinator.com
          </p>
          <p class="has-text-light is-paddingless">
            password: sweetpotato1
          </p>
        </article>
      </div>
    </template>
    <template v-slot:content>
      <slot />
    </template>
  </BaseSideBarLayout>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import BaseSideBarLayout from '@/components/layouts/BaseSideBarLayout.vue';

@Component( {
    components: {BaseSideBarLayout}
  })
  export default class InfoSideBarLayout extends Vue {
    sideMenuShownMobile: boolean = true;

    @Prop()
    username!: string;
    
    }
</script>
