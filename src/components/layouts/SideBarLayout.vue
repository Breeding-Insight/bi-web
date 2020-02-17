<template>
  <main>
    <div class="level header-title is-marginless">
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
        <h1 class="title has-text-primary">Program Name Here</h1>
      </div>
    </div>

    <div class="columns is-gapless">
      <div class="column is-one-quarter side-menu">
        <b-menu class="side-menu-body">
          <b-menu-item label="Home" tag="router-link" to="/"></b-menu-item>
          <b-menu-item label="Manage Users" tag="router-link" to="/usermanagement"></b-menu-item>
          <b-menu-item label="Trials and Experiments"></b-menu-item>
          <b-menu-item label="Germplasm Inventory"></b-menu-item>
          <b-menu-item label="Ontology Management"></b-menu-item>
          <b-menu-item label="Labels"></b-menu-item>
          <b-menu-item label="Reports"></b-menu-item>
          <b-menu-item label="Program Management" tag="router-link" to="/program-management"></b-menu-item>
        </b-menu>
      </div>
      <div class="column">
        <div class="container">
          <slot></slot>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  @Component
  export default class SideBarMaster extends Vue {
  }

</script>

<style>

</style>