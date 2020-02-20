<template>
  <BaseModal
    v-bind:active="active"
    v-on:close-modal="$emit('close-modal')"
  >
    <slot></slot>
  </BaseModal>

</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import BaseModal from '@/components/modals/BaseModal.vue';

  @Component({
    components: {BaseModal}
  })
  export default class InfoModal extends Vue {
    @Prop()
    active!: boolean;
  }

</script>