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
    <main id="main">
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