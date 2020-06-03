<!--
  - See the NOTICE file distributed with
  - this work for additional information regarding copyright ownership.
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
  <div class="login">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Welcome to the Breeding Insight Platform!
          </h1>
          <p>To continue, please log in</p>
        </div>
      </div>
    </section>
    <section>
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="card auth">
            <div class="card-content">
              <div class="columns is-centered">
                <figure class="image eauth">
                  <img
                    src="../assets/img/eauth.svg"
                    alt="eAuth logo"
                    class="column"
                  >
                </figure>
              </div>
              <div>
                <button
                  class="button is-primary"
                  @click="logIn"
                >
                  Login via eAuth >
                </button>
              </div>
              <div class="idp">
                <small>Don't have an eAuth account? <a href="#">Login via BIP ></a></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { LOGIN, REQUESTED_PATH } from '@/store/mutation-types';

@Component
export default class Login extends Vue {
  public loggedIn: boolean = false;

  logIn (): void {
    this.$store.commit(LOGIN);
    if(this.$store.state.requestedPath) {
      const requestedPath = this.$store.state.requestedPath;
      this.$store.commit(REQUESTED_PATH, {path: undefined});
      this.$router.push(requestedPath);
    } else {
      this.$router.push('/');
    }
  }
}
</script>