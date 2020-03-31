<template>
  <td>
    <slot></slot>
  </td>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component
  export default class TableRowColumn extends Vue {
  }

</script>