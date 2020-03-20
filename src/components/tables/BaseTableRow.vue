<template>
  <tr v-bind:class="{'is-new': (rowData.new == true && rowData.edit == false), 'is-selected': (rowData.edit == true)}" >
    <slot></slot>
    <template v-if="rowData.editable">
      <td class="has-text-right">
        <a v-on:click="$emit('edit')">Edit</a>
        <span class="icon is-small margin-right-2 span-verticial-middle">
          <ChevronRightIcon size="1x" aria-hidden="true"></ChevronRightIcon>
        </span>
        <a class="" v-on:click="$emit('cancel')">Deactivate</a>
      </td>
    </template>
  </tr>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {ChevronRightIcon} from 'vue-feather-icons'

  @Component({
    components: { ChevronRightIcon }
  })
  export default class BaseTableRow extends Vue {

    // Knows its row values and its column objects
    @Prop()
    rowData!: any;

    mounted() {
      this.$emit('new');
    }
  }
</script>