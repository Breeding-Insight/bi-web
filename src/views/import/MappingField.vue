<template>
  <div>
    <template v-if="field.type === ImportDataType.OBJECT">
      <!-- Loop through fields and create mapping -->
      <template v-for="objectField of field.fields">
        <MappingField
          v-bind:key="`${field.id}.${objectField.id}`"
          v-bind:field="objectField"
          v-bind:col-options="colOptions"
          v-bind:parent-path="path"
          v-on="$listeners"
        />
      </template>
    </template>
    <template v-else-if="field.type !== ImportDataType.OBJECT">
      <!-- Primitive type just display field -->
      <div class="columns">
        <div class="column">
          {{ field.name }} =
        </div>
        <div class="column">
          <BasicSelectField
              v-bind:selected-id="getValue()"
              v-bind:field-name="'File Column'"
              v-bind:options="colOptions"
              v-bind:empty-value-name="`-- ${field.name} column --`"
              v-bind:show-label="false"
              v-on:input="$emit('mapping', new MapEvent(path, $event))"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">

import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {EditIcon} from 'vue-feather-icons';
import {Mapping} from "@/breeding-insight/model/import/Mapping";
import {ImportDataType, ImportField} from "@/breeding-insight/model/import/ImportField";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {MapEvent} from "@/views/import/MapEvent";
import {ImportMapping} from "@/breeding-insight/model/import/ImportMapping";

@Component({
  components: {EditIcon, MappingField, BasicSelectField},
  data: () => ({ImportDataType, MapEvent}),
})
export default class MappingField extends Vue {
  @Prop()
  field!: ImportField;
  @Prop()
  colOptions!: any[];
  @Prop()
  mapping?: ImportMapping;
  @Prop()
  parentPath?: string;

  // Parent path + this one
  private path?: string = this.parentPath ? `${this.parentPath}.${this.field.id}` : this.field.id;

  getValue() {
    console.log(this.path);
    if (this.mapping) return this.mapping!.getFieldValue(this.path!);
  }
}
</script>