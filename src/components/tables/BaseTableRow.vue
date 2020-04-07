<template>
  <tr v-bind:class="{'is-new': (rowData.new == true && rowData.edit == false && showNewHighlight), 'is-selected': (rowData.edit == true)}" >
    <slot></slot>
    <template v-if="rowData.editable">
      <td class="has-text-right">
        <a
          v-on:click="$emit('edit')"
          v-on:keypress.enter.space="$emit('edit')"
          tabindex="0"
        >
          Edit
        </a>
        <span v-if="!rowData.edit" class="icon is-small margin-right-2 has-vertical-align-middle">
          <ChevronRightIcon size="1x" aria-hidden="true"></ChevronRightIcon>
        </span>
        <span v-if="rowData.edit" class="icon is-small margin-right-2 has-vertical-align-middle">
          <ChevronDownIcon size="1x" aria-hidden="true"></ChevronDownIcon>
        </span>
        <a
          v-on:click="$emit('remove')"
          v-on:keypress.enter.space="$emit('remove')"
          tabindex="0"
        >
          Deactivate
        </a>
      </td>
    </template>
  </tr>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {ChevronRightIcon, ChevronDownIcon} from 'vue-feather-icons'

  @Component({
    components: { ChevronRightIcon, ChevronDownIcon }
  })
  export default class BaseTableRow extends Vue {

    // Knows its row values and its column objects
    @Prop()
    rowData!: any;

    private showNewHighlight: boolean = true;

    updated() {
      // Once the table component is updated, remove the new highlighting for this row
      this.showNewHighlight = false;
    }
  }
</script>