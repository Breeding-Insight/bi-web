<template>

  <div
      class="modal"
      v-bind:class="{ 'is-active': active }"
  >
    <div class="modal-background" v-on:click="$emit('close-modal')" />
    <div class="modal-card">
      <header class="modal-card-head">
        <div class="modal-card-title" />
        <button
            class="delete"
            aria-label="close"
            @click="$emit('close-modal')"
        />
      </header>
      <section
        class="modal-card-body"
        v-bind:class="bodyClass"
      >
        <slot></slot>
      </section>
      <footer class="modal-card-foot"/>
    </div>
  </div>

</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component
  export default class BaseModal extends Vue {
    @Prop()
    active!: boolean;
    @Prop()
    bodyClass!: Object;
  }

</script>