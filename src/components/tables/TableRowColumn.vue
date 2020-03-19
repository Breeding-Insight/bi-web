<template>
  <td>
    <slot></slot>
  </td>
</template>

<script lang="ts">

  import {Component, Prop, Vue} from "vue-property-decorator";

  @Component
  export default class TableRowColumn extends Vue {

    // Knows its own value
    @Prop()
    name!: string;
    // Contains information on its edit component
    //columnData!: any;
  }

</script>