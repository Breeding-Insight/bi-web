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
      <div class="column is-full">
        <p class="title">Welcome, {{ activeUser.name }}!</p>
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