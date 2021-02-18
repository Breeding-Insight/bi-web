<template>
  <div>
    <div class="box">
      Select an import to begin:
      <div class="columns">
        <div class="column is-half">
          <BasicSelectField
              v-bind:field-name="'Import Type'"
              v-bind:options="['Water Quality']"
          />
        </div>
        <div class="column is-half">
          <!-- TODO: Only available for admins -->
          <a
            v-on:click="importService.send(ImportEvent.CREATE_NEW_IMPORT)"
          >
            Create New Import
          </a>
        </div>
      </div>
    </div>

    <FileSelectMessageBox
        v-if="showImport"
        v-model="file"
        v-bind:fileTypes="'.csv, .xls, .xlsx'"
        v-bind:errors="import_errors"
        v-on:import="importService.send(ImportEvent.IMPORT_STARTED)"
    />

    <div
      v-if="importTypeShow"
      class="box mt-5"
    >
      <!-- TODO: Show how many times each column is used -->
      What type of data are you importing?
      <BasicSelectField
          v-bind:field-name="'Import Data Type'"
          v-bind:options="importConfigOptions"
          v-on:input="selectImportConfig($event)"
      />
      <template
        v-if="selectedImportConfig !== null"
      >
        <p>{{selectedImportConfig.description}}</p>
      </template>
      <button
        class="button is-primary"
        v-on:click="importService.send(ImportEvent.IMPORT_TYPE_SELECTED)"
      >
        Select
      </button>
    </div>

    <div
        v-if="showMapping"
        class="box mt-5"
    >
      We found the following columns in your file:
      <div class="tags">
        <template v-for="header in importData.headers">
          <span
            class="tag"
            v-bind:key="header"
          >
            {{header}}
          </span>
        </template>
      </div>

      <!-- Groups -->
      <template v-for="({config, object}) in getMappings()">
        <div
          v-bind:key="object.id"
          class="box"
        >
          <h2 class="h2">{{config.name}}</h2>
          <p>{{config.description}}</p>
          <template v-for="field in config.fields">
            <!-- Simple fields -->
            <FieldMappingRow
                v-if="field.type !== ImportDataType.List && field.type !== ImportDataType.Relationship"
                v-bind:key="field.id"
                v-bind:field="field"
                v-bind:fileFields="importData.headers"
                v-on:mapping="mapping.getObjectMapping(object.id).setFieldMapping(config.id, $event)"
                v-on:manualEntry="mapping.getObjectMapping(object.id).setManualMapping(config.id, $event)"
            />

            <!-- List fields -->
            <template v-else-if="field.type === ImportDataType.List">
              <div v-bind:key="field.id">
                <h2>{{field.name}}</h2>
                <p>{{field.description}}</p>
                <template v-for="({config: subConfig, object: subObject}) in getObjectListMappings(field.list_object, object, field.id)">
                  <div
                    v-bind:key="subObject.id"
                  >
                    <template v-for="subfield in subConfig.fields">
                      <FieldMappingRow
                          v-bind:key="subfield.id"
                          v-bind:field="subfield"
                          v-bind:fileFields="importData.headers"
                          v-on:mapping="mapping.getObjectMapping(subObject.id).setFieldMapping(subfield.id, $event)"
                          v-on:manualEntry="mapping.getObjectMapping(subObject.id).setManualMapping(subfield.id, $event)"
                      />
                    </template>
                  </div>
                </template>
                <div class="columns">
                  <div class="column has-text-right">
                    <button
                        class="button is-primary"
                        v-on:click="createNewListMappingEntry(object.id, field.id, field.list_object)"
                    >
                      Add {{field.list_object.name}}
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Relationship objects -->
            <template v-else-if="field.type === ImportDataType.Relationship">
              <div v-bind:key="field.id">
                <h2>{{field.name}}</h2>
                <p>{{field.description}}</p>
                <template v-if="field.relation_options.length > 1">
                  <div class="control">
                    <template v-for="relation_type in field.relation_options">
                      <label
                        v-bind:key="relation_type.id"
                        class="radio"
                      >
                        <input
                          type="radio"
                          v-bind:name="`${field.id} relation`"
                          v-bind:value="relation_type.id"
                          v-on:input="setRelationType(object, field, $event.target.value)"
                        >
                        {{relation_type.name}}
                      </label>
                    </template>
                  </div>
                </template>
                <!-- Relationship view -->
                <template v-if="object.getField(field.id) && object.getField(field.id).relationValue === ImportRelationType.DB_LOOKUP">
                  <div class="columns">
                    <div class="column">
                      <BasicSelectField
                          v-bind:options="field.getRelationObject(ImportRelationType.DB_LOOKUP).importFields"
                          v-bind:field-name="`Import Field Target`"
                          v-bind:empty-value-name="`-- Import Field column --`"
                          v-on:input="object.getField(field.id).setRelationTarget($event)"
                      />
                    </div>
                    <div class="column">
                      <BasicSelectField
                          v-bind:options="importData.headers"
                          v-bind:field-name="`File Field Reference Column`"
                          v-bind:empty-value-name="`-- File Field column --`"
                          v-on:input="object.getField(field.id).setRelationReference($event)"
                      />
                    </div>
                  </div>
                </template>
                <template v-else-if="object.getField(field.id) && object.getField(field.id).relationValue === ImportRelationType.FILE_LOOKUP">
                  <div class="columns">
                    <div class="column">
                      <BasicSelectField
                          v-bind:options="importData.headers"
                          v-bind:field-name="`File Field Column Target`"
                          v-bind:empty-value-name="`-- File Field column --`"
                          v-on:input="object.getField(field.id).setRelationTarget($event)"
                      />
                    </div>
                    <div class="column">
                      <BasicSelectField
                          v-bind:options="importData.headers"
                          v-bind:field-name="`Import Field Column Reference`"
                          v-bind:empty-value-name="`-- File Field column --`"
                          v-on:input="object.getField(field.id).setRelationReference($event)"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">


  import {Component, Vue} from "vue-property-decorator";
  import BasicSelectField from "../../components/forms/BasicSelectField";
  import {createMachine, interpret} from "@xstate/fsm";
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue";
  import {ImportService} from "@/breeding-insight/service/ImportService";
  import {ImportTypeConfig} from "@/breeding-insight/model/import/ImportTypeConfig";
  import {ImportData} from "@/breeding-insight/model/import/ImportData";
  import {ImportDataType, ImportField} from "@/breeding-insight/model/import/ImportField";
  import {ImportMappingConfig} from "@/breeding-insight/model/import/ImportMapping";
  import FieldMappingRow from "@/components/import/FieldMappingRow.vue";
  import {ImportGroup} from "@/breeding-insight/model/import/ImportGroup";
  import {ObjectMapping} from "@/breeding-insight/model/import/ObjectMapping";
  import {ImportRelationType} from "@/breeding-insight/model/import/ImportRelation";

  enum ImportState {
    CHOOSE_IMPORT = "CHOOSE_IMPORT",
    NEW_IMPORT = "NEW_IMPORT",
    IMPORTING = "IMPORTING",
    LOADING = "LOADING",
    IMPORT_ERROR = "IMPORT_ERROR",
    CHOOSE_IMPORT_TYPE = "CHOOSE_IMPORT_TYPE",
    MAPPING = "MAPPING"
  }

  enum ImportEvent {
    CREATE_NEW_IMPORT = "CREATE_NEW_IMPORT",
    IMPORT_STARTED = "IMPORT_STARTED",
    IMPORT_SUCCESS = "IMPORT_SUCCESS",
    IMPORT_ERROR = "IMPORT_ERROR",
    LOADING_COMPLETE = "LOADING_COMPLETE",
    IMPORT_TYPE_SELECTED = "IMPORT_TYPE_SELECTED"
  }

  enum ImportAction {
    RESET = "RESET",
    SHOW_IMPORT = "SHOW_IMPORT",
    UPLOAD_FILE = "UPLOAD_FILE",
    LOADED = "LOADED",
    GET_UPLOADED_FILE = "GET_UPLOADED_FILE",
    SHOW_IMPORT_TYPE = "SHOW_IMPORT_TYPE",
    MAPPING_STARTED = "MAPPING_STARTED"
  }

  @Component({
    components: {FieldMappingRow, BasicSelectField, FileSelectMessageBox},
    data: () => ({ImportState, ImportEvent, ImportAction, ImportDataType, ImportRelationType})
  })
  export default class BrAPIImporter extends Vue {

    private file : File | null = null;
    private import_errors: ValidationError | string | null = null;
    private showImport: boolean = false;
    private dataLoaded: boolean = false;
    private importTypeShow: boolean = false;
    private showMapping: boolean = false;

    private currentImportId: string = '1';
    private importConfigs: ImportTypeConfig[] = [];
    private selectedImportConfig: ImportTypeConfig | null = null
    private importData = ImportData;
    private importConfigOptions: any[] = [];
    private mapping: ImportMappingConfig = new ImportMappingConfig(undefined);

    private state = ImportState.CHOOSE_IMPORT;
    private importStateMachine = createMachine({
        id: 'import',
        initial: ImportState.CHOOSE_IMPORT,
        states: {
          [ImportState.CHOOSE_IMPORT]: {
            entry: ImportAction.RESET,
            on: {
              [ImportEvent.CREATE_NEW_IMPORT]: ImportState.NEW_IMPORT
            }
          },
          [ImportState.NEW_IMPORT]: {
            entry: ImportAction.SHOW_IMPORT,
            on: {
              [ImportEvent.IMPORT_STARTED]: ImportState.IMPORTING
            }
          },
          [ImportState.IMPORTING]: {
            entry: ImportAction.UPLOAD_FILE,
            on: {
              [ImportEvent.IMPORT_SUCCESS]: ImportState.LOADING,
              [ImportEvent.IMPORT_ERROR]: ImportState.IMPORT_ERROR,
            }
          },
          [ImportState.LOADING]: {
            entry: ImportAction.GET_UPLOADED_FILE,
            on: {
              [ImportEvent.LOADING_COMPLETE]: {
                target: ImportState.CHOOSE_IMPORT_TYPE,
                actions: ImportAction.LOADED
              },
            }
          },
          [ImportState.CHOOSE_IMPORT_TYPE]: {
            entry: ImportAction.SHOW_IMPORT_TYPE,
            on: {
              [ImportEvent.IMPORT_TYPE_SELECTED]: ImportState.MAPPING
            }
          },
          [ImportState.MAPPING]: {
            entry: ImportAction.MAPPING_STARTED,
            on: {}
          }
        }
      },
      {
        actions: {
          [ImportAction.RESET]: (context, event) => {
            this.showImport = false;
            this.importTypeShow = false;
          },
          [ImportAction.SHOW_IMPORT]: (context, event) => {
            this.importSelected();
          },
          [ImportAction.UPLOAD_FILE]: (context, event) => {
            this.upload();
          },
          [ImportAction.LOADED]: (context, event) => {
            this.loaded();
          },
          [ImportAction.GET_UPLOADED_FILE]: (context, event) => {
            this.getImport();
          },
          [ImportAction.SHOW_IMPORT_TYPE]: (context, event) => {
            this.showImportType();
            this.getImportConfigs();
          },
          [ImportAction.MAPPING_STARTED]: (context, event) => {
            this.startMapping();
          }
        }
    });

    private initialState = this.importStateMachine;
    private importService = interpret(this.importStateMachine);

    created() {
      this.importService.subscribe(state => {
        this.state = ImportState[state.value as keyof typeof ImportState];
      });
      this.importService.start();
    }

    async upload() {
      // TODO: Upload to upload service and set import id
      this.currentImportId = this.currentImportId;
      this.importService.send(ImportEvent.IMPORT_SUCCESS);
    }

    loaded() {
      this.dataLoaded = true;
    }

    importSelected() {
      this.showImport = true;
    }

    showImportType() {
      this.importTypeShow = true;
    }

    startMapping() {
      // Get the import config
      this.mapping = new ImportMappingConfig(undefined);
      this.mapping.createObjectMappings(this.selectedImportConfig!.groups);
      this.showMapping = true;
    }

    async getImportConfigs() {
      try {
        const importConfigs: ImportTypeConfig[] = await ImportService.getAllImportTypeConfigs();
        this.importConfigs = importConfigs;
        this.importConfigOptions = importConfigs.map(importConfig => { return { 'id': importConfig.id, 'name': importConfig.name}; });
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load import configs file`);
      }
    }

    async getImport() {
      try {
        const importData: ImportData = await ImportService.getImport(this.currentImportId);
        this.importData = importData;
        this.importService.send(ImportEvent.LOADING_COMPLETE);
      } catch (e) {
        this.$log.error(e);
        this.$emit('show-error-notification', `Unable to load imported file`);
      }
    }

    selectImportConfig(importId: string) {
      this.selectedImportConfig = this.importConfigs.filter(importConfig => importConfig.id === importId)[0];
    }

    // Does not actually have possibility for object to be undefined
    getMappings(): {config: ImportGroup, object?: ObjectMapping}[] {
      const results = this.selectedImportConfig!.groups.map(importGroup => {
        const object = this.mapping.objects!.find(object => object.object_id === importGroup.id);
        return { config: importGroup, object };
      }).filter(result => result.object);
      return results;
    }

    getObjectListMappings(importGroup: ImportGroup, targetObject: ObjectMapping, targetField: string): {config: ImportGroup, object?: ObjectMapping}[] {
      const results = targetObject.getObjectsFromListField(targetField).map(object => { return { config: importGroup, object} });
      return results;
    }

    createNewListMappingEntry(objectId: string, targetField: string, importGroup: ImportGroup) {
      const objectMapping = this.mapping.getObjectMapping(objectId);
      if (objectMapping) {
        const object = objectMapping.addObjectToListField(targetField, importGroup);
      } else {
        this.$emit('show_error_notification', `Unable to add ${importGroup.name} object`);
      }

      // TODO: Reactivity issue somewhere in here. Need to track it down.
      this.$forceUpdate();
    }

    setRelationType(object: ObjectMapping, field: ImportField, value: ImportRelationType) {
      this.mapping.getObjectMapping(object.id!)!.setRelationType(field.id, value);
      // TODO: Reactivity issue somewhere in here. Need to track it down.
      this.$forceUpdate();
    }
  }

  //TODO:
  // - Implement mapping. Print out results when it is sent to dao layer
  // - Implement relationship searching params
  // - Define options
  // - Create phenotyping upload config in service

</script>

<style scoped>

</style>