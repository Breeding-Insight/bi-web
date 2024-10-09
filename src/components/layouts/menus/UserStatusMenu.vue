<!--
  - See the NOTICE file distributed with this work for additional information regarding copyright ownership.
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
  <b-dropdown v-if="username !== undefined"
              position="is-bottom-left"
              append-to-body
              aria-role="menu">
    <template #trigger>
      <button
          class="button is-small is-primary has-text-weight-bold"
          v-bind:id="dropDownId"
          aria-label="User Status"
      >
        <b-icon icon="user" class="mr-0"></b-icon>
        <b-icon icon="chevron-down" class="ml-0"></b-icon>
      </button>
    </template>
    <b-dropdown-item custom aria-role="menuitem" v-bind:id="userNameId">
      Logged in as <strong>{{username}}</strong>
    </b-dropdown-item>
    <hr class="dropdown-divider">
    <b-dropdown-item value="logout" aria-role="menuitem" :id="logoutId" @click="$emit('logout')">
      <b-icon icon="log-out"></b-icon>
      Logout
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component({
  components: {},
})
export default class UserStatusMenu extends Vue {
  @Prop()
  username!: string;

  private logoutId: string = "userstatusmenu-logout-button";
  private dropDownId: string = "userstatusmenu-dropdown-button";
  private userNameId: string = "userstatusmenu-username";
}

</script>