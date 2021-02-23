<template>
  <div>
    <!-- Select Import Option -->
    <template v-if="focusObjectId === null">
      <ImportStepCard
          title="Step 1: Select Import Option"
          v-bind:completed="1 < this.currentStep"
          v-bind:readonly="1 < this.currentStep"
      >
        <template v-slot:write-display>
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
        </template>
        <template v-slot:summary-display>
          I am a summary
        </template>
      </ImportStepCard>

      <!-- Choose File -->
      <ImportStepCard
          v-if="showImport"
          title="Step 2: Upload File"
          v-bind:completed="2 < this.currentStep"
          v-bind:readonly="2 < this.currentStep"
      >
        <!-- Editing view -->
        <template v-slot:write-display>
          <FileSelectMessageBox
              v-model="file"
              v-bind:fileTypes="'.csv, .xls, .xlsx'"
              v-bind:errors="import_errors"
              v-on:import="importService.send(ImportEvent.IMPORT_STARTED)"
          />
        </template>

        <!-- Summary View -->
        <template v-slot:summary-display>
          I am the summary
        </template>
      </ImportStepCard>

      <!-- Specify Mapping Metadata -->
      <ImportStepCard
          v-if="importTypeShow"
          title="Step 3: Mapping Metadata"
          v-bind:completed="3 < this.currentStep"
          v-bind:readonly="3 < this.currentStep"
      >
        <!-- Editing view -->
        <template v-slot:write-display>
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
        </template>
        <!-- Summary view -->
        <template v-slot:summary-display>
          I am a summary
        </template>
      </ImportStepCard>

      <!-- Create the Mapping -->
      <ImportStepCard
          v-if="showMapping"
          title="Step 4: Create Mapping"
          v-bind:completed="4 < this.currentStep"
          v-bind:readonly="4 < this.currentStep"
      >
        <!-- Editing View -->
        <template v-slot:write-display>
          <ColumnSummary v-bind:columns="importData.headers"></ColumnSummary>

          <!-- Groups -->
          <template v-for="({config, object}) in getMappings()">
            <ImportGroupSummaryCard
                v-bind:key="`test ${object.id}`"
                v-bind:config="config"
                v-bind:object="object"
                v-on:focus-object="setFocusObject($event)"
            />
          </template>
        </template>

        <!-- Summary View -->
        <template v-slot:summary-display>
          I am a summary
        </template>
      </ImportStepCard>
    </template>

    <!-- Detailed View -->
    <template v-if="focusObjectId !== null">
      <!-- Actual stuff -->
      <template v-for="({config, object, path}) in [getMapping(focusObjectId)]">

        <!-- Breadcrumbs -->
        <nav class="breadcrumb" aria-label="breadcrumbs" v-bind:key="`nav${object.id}`">
          <ul>
            <li>
              <a v-on:click="setFocusObject(null)">
                <span>Mapping - {{selectedImportConfig.name}} Import</span>
              </a>
            </li>
            <template v-for="{pathConfig, pathObject} in getObjectPathWithConfig(path)">
              <li
                v-bind:key="`breadcrumb${pathObject.id}`"
                v-bind:class="{'is-active': pathObject.id === focusObjectId}"
              >
                <a href="#" v-on:click="setFocusObject(pathObject.id)">
                <span class="icon is-small">
                  <i class="fas fa-thumbs-up" aria-hidden="true"></i>
                </span>
                  <span>{{pathConfig.name}}</span>
                </a>
              </li>
            </template>
          </ul>
        </nav>

        <div
          v-bind:key="`objectDescription ${config.id}`"
        >
          <h1 class="title is-1">{{config.name}}</h1>
          <div class="subtitle ml-2">
            <p>{{config.description}}</p>
          </div>
        </div>

        <div
          v-bind:key="`columnSummary${object.id}`"
          class="box"
        >
          <h2 class="title is-4">Reminder</h2>
          <ColumnSummary v-bind:columns="importData.headers" />
        </div>

        <template v-for="field in config.fields">
          <!-- Simple fields -->
          <template v-if="field.type !== ImportDataType.List && field.type !== ImportDataType.Relationship">
            <div
                v-bind:key="field.id"
                class="box mb-5"
            >
              <FieldMappingRow
                  v-bind:key="field.id"
                  v-bind:field="field"
                  v-bind:fileFields="importData.headers"
                  v-bind:mapping="object.getField(field.id)"
                  v-on:mapping-change="replaceMapping(object, field, $event)"
              />
            </div>
          </template>

          <!-- List fields -->
          <template v-else-if="field.type === ImportDataType.List">
            <div
                v-bind:key="field.id"
                class="box"
            >
              <ListMappingRow
                v-bind:field="field"
                v-bind:mapping="object.getField(field.id)"
                v-on:mapping-change="replaceMapping(object, field, $event)"
                v-on:focus-object="focusObjectId = $event"
              />
            </div>
          </template>

          <!-- Relationship objects -->
          <template v-else-if="field.type === ImportDataType.Relationship">
            <div
                v-bind:key="field.id"
                class="box"
            >
              <RelationMappingRow
                  v-bind:field="field"
                  v-bind:mapping="object.getField(field.id)"
                  v-bind:file-columns="importData.headers"
                  v-on:mapping-change="replaceMapping(object, field, $event)"
              />
            </div>
          </template>
        </template>
      </template>
    </template>

  </div>
</template>

<script lang="ts">


  import {Component, Vue} from "vue-property-decorator";
  import BasicSelectField from "@/components/forms/BasicSelectField";
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
  import {ChevronDownIcon} from "vue-feather-icons";
  import ImportStepCard from "@/components/import/ImportStepCard.vue";
  import ImportGroupSummaryCard from "@/components/import/ImportGroupSummaryCard.vue";
  import ColumnSummary from "@/components/import/ColumnSummary.vue";
  import RelationMappingRow from "@/components/import/RelationMappingRow.vue";
  import {Mapping} from "@/breeding-insight/model/import/Mapping";
  import ListMappingRow from "@/components/import/ListMappingRow.vue";

  enum ImportState {
    CHOOSE_IMPORT = "CHOOSE_IMPORT",
    CHOOSE_FILE = "CHOOSE_FILE",
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
    MAPPING_STARTED = "MAPPING_STARTED",
    NEXT_STEP = "NEXT_STEP"
  }

  @Component({
    components: {
      ListMappingRow,
      RelationMappingRow,
      ColumnSummary,
      ImportGroupSummaryCard, ImportStepCard, FieldMappingRow, BasicSelectField, FileSelectMessageBox, ChevronDownIcon},
    data: () => ({ImportState, ImportEvent, ImportAction, ImportDataType, ImportRelationType})
  })
  export default class BrAPIImporter extends Vue {

    private file : File | null = null;
    private import_errors: ValidationError | string | null = null;
    private showImportOption: boolean = false;
    private showImport: boolean = false;
    private dataLoaded: boolean = false;
    private importTypeShow: boolean = false;
    private showMapping: boolean = false;
    private focusObjectId: string | null = null;

    private currentImportId: string = '1';
    private importConfigs: ImportTypeConfig[] = [];
    private selectedImportConfig: ImportTypeConfig | null = null
    private importData = ImportData;
    private importConfigOptions: any[] = [];
    private mapping: ImportMappingConfig = new ImportMappingConfig(undefined);

    private currentStep = 1;
    private state = ImportState.CHOOSE_IMPORT;
    private importStateMachine = createMachine({
        id: 'import',
        initial: ImportState.CHOOSE_IMPORT,
        states: {
          [ImportState.CHOOSE_IMPORT]: {
            entry: ImportAction.RESET,
            on: {
              [ImportEvent.CREATE_NEW_IMPORT]: {
                target: ImportState.CHOOSE_FILE,
                actions: [ImportAction.NEXT_STEP]
              }
            }
          },
          [ImportState.CHOOSE_FILE]: {
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
                actions: [ImportAction.LOADED, ImportAction.NEXT_STEP]
              },
            }
          },
          [ImportState.CHOOSE_IMPORT_TYPE]: {
            entry: ImportAction.SHOW_IMPORT_TYPE,
            on: {
              [ImportEvent.IMPORT_TYPE_SELECTED]: {
                target: ImportState.MAPPING,
                actions: ImportAction.NEXT_STEP
              }
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
          [ImportAction.NEXT_STEP]: (context, event) => {
            this.incrementStep();
          },
          [ImportAction.RESET]: (context, event) => {
            this.currentStep = 1;
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

    incrementStep() {
      this.currentStep += 1;
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

    getMapping(id: string): {config?: ImportGroup, object?: ObjectMapping, path?: ObjectMapping[]} | undefined {
      const {searchObject, searchPath} = this.mapping.getObjectMapping(id);
      if (searchObject){
        return {config: this.selectedImportConfig!.getImportGroup(searchObject.object_id), object: searchObject, path: searchPath}
      } else {
        return undefined;
      }
    }

    //TODO: We can make one funtion to combine object and config
    getObjectPathWithConfig(path: ObjectMapping[]): {pathConfig?: ImportGroup, pathObject?: ObjectMapping}[] {
      const result = path.map(pathObject => { return {pathConfig: this.selectedImportConfig!.getImportGroup(pathObject.object_id), pathObject}});
      console.log(result);
      return result;
    }

    replaceMapping(object: ObjectMapping, field: ImportField, newMapping: Mapping) {
      const {searchObject} = this.mapping.getObjectMapping(object.id!);
      searchObject!.replaceMapping(field.id, newMapping);
      this.$forceUpdate();
    }

    setFocusObject(id: string) {
      this.focusObjectId = id;
    }

  }

  //TODO:
  // - Make UI pretty
  //    - Have summary one liner to put in the title
  //    - Add descriptions for each step
  //    - Add a mapping summary
  //    - Make mapping fields prettier
  //      - Make mapping fields cards
  //    - Complete summary fields
  // - Add alias option for field mapping
  // - Connect remaining services, like upload
  // - Fix responsiveness issues
  //    - Lists
  //    - Relationships
  // - Define options
  // - Create phenotyping upload config in service. Allow the dev user to switch back and forth
  // - Prototype a real-time lookup relationship
  // - Save to local storage, so if they hit the back button, it doesn't lose all of their data

</script>

<style scoped>

</style>