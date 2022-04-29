<template>
  <div>
    <div class="columns">
      <!-- Mapping column -->
        <!-- Nest object fields in an accordian -->
        <!-- Only display required fields to start -->
      <div class="column is-three-quarters">
        Mapping:
        <!-- Recursively define template rows -->
        <template v-for="nonObjectField of template.fields">
          <!-- If not object, display field at top -->
          <template v-if="nonObjectField.type !== ImportDataType.OBJECT">
            <MappingField
              v-bind:key="nonObjectField.id"
              v-bind:field="nonObjectField"
              v-bind:col-options="colOptions"
              v-bind:mapping="mapping"
              v-on="$listeners"
            />
          </template>
        </template>

        <template v-for="objectField of template.fields">
          <!-- If not object, display field at top -->
          <template v-if="objectField.type === ImportDataType.OBJECT">
            <MappingField
                v-bind:key="objectField.id"
                v-bind:field="objectField"
                v-bind:col-options="colOptions"
                v-bind:parentPath="objectField.id"
                v-bind:mapping="mapping"
                v-on="$listeners"
            />
          </template>
        </template>
      </div>
      <!-- File columns column -->
      <div class="column is-one-quarter">
        Columns:
        <ColumnSummary v-bind:columns="fileCols"></ColumnSummary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from "vue-property-decorator";
import {mapGetters} from "vuex";
import {ImportTemplate} from "@/breeding-insight/model/import/ImportTemplate";
import {ImportMapping} from "@/breeding-insight/model/import/ImportMapping";
import ColumnSummary from "@/components/import/ColumnSummary.vue";
import {ImportDataType} from "@/breeding-insight/model/import/ImportField";
import MappingField from "@/views/import/MappingField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";

@Component({
  components: {MappingField, ColumnSummary, BasicSelectField},
  data: () => ({ImportDataType}),
})
export default class ImportMappingView extends Vue {

  @Prop()
  private template!: ImportTemplate;

  @Prop()
  private mapping!: ImportMapping;

  @Prop()
  private fileCols!: String[];

  private colOptions: any[] = [];

  // Access mapping with string accessor eg. germplasm.germplasmName[0]
  @Watch('fileCols')
  generateColOptions(){
    this.colOptions = this.fileCols.map(col => { return {'id': col, 'name': col}});
  }
}

</script>

<style scoped>

</style>