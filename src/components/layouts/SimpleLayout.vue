<template>
  <div>
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
                <router-link to="/styleguide">
                  Style Guide
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/usermanagement">
                  Manage Users
                </router-link>
              </li>
              <li class="navbar-item">
                <router-link to="/program-management">
                  Program Management
                </router-link>
              </li>
              <li class="navbar-item">
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

  @Component
  export default class SimpleLayout extends Vue {

  }

</script>