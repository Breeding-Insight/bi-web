<template>
  <WarningModal
      v-bind="$props"
      v-bind:msg-title="'Server Error: Login Failed'"
      v-on:deactivate="$emit('deactivate')"
  >
    <section>
      <p class="has-text-dark" :class="this.$modalTextClass">
        This application was unable to establish a connection with our servers. Please try again.
      </p>
      <p class="has-text-dark" :class="this.$modalTextClass">
        If you continue to experience problems, try
        <a href="http://status.orcid.org/">checking the ORCID status page</a>.
        If all else fails,
        <a href="#!">contact Breeding Insight support</a>.
      </p>
    </section>
  </WarningModal>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import WarningModal from '@/components/modals/WarningModal.vue'

  @Component({
    components: {WarningModal}
  })
  export default class ServerContactErrorModal extends Vue {
    @Prop()
    active!: boolean;
  }
</script>
