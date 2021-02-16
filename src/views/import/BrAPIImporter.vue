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
      <!-- TODO: Show columns in the file -->
      What type of data are you importing?
      <BasicSelectField
          v-bind:field-name="'Import Data Type'"
          v-bind:options="['Germplasm', 'Phenotyping']"
      />
      <!-- TODO: Show a description of the import when they select it -->
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
      <!-- TODO: Show columns in the file -->
      I am the mapping box
    </div>

  </div>
</template>

<script lang="ts">


  import {Component, Vue} from "vue-property-decorator";
  import BasicSelectField from "../../components/forms/BasicSelectField";
  import {createMachine, interpret} from "@xstate/fsm";
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import FileSelectMessageBox from "@/components/file-import/FileSelectMessageBox.vue";

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
    MOCK_LOADING = "MOCK_LOADING",
    SHOW_IMPORT_TYPE = "SHOW_IMPORT_TYPE",
    MAPPING_STARTED = "MAPPING_STARTED"
  }

  @Component({
    components: {BasicSelectField, FileSelectMessageBox},
    data: () => ({ImportState, ImportEvent, ImportAction})
  })
  export default class BrAPIImporter extends Vue {

    private file : File | null = null;
    private import_errors: ValidationError | string | null = null;
    private showImport: boolean = false;
    private dataLoaded: boolean = false;
    private importTypeShow: boolean = false;
    private showMapping: boolean = false;

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
          [ImportState.CHOOSE_IMPORT_TYPE]: {
            entry: ImportAction.SHOW_IMPORT_TYPE,
            on: {
              [ImportEvent.IMPORT_TYPE_SELECTED]: ImportState.MAPPING
            }
          },
          [ImportState.LOADING]: {
            // TODO: Remove this
            entry: ImportAction.MOCK_LOADING,
            on: {
              [ImportEvent.LOADING_COMPLETE]: {
                target: ImportState.CHOOSE_IMPORT_TYPE,
                actions: ImportAction.LOADED
              },
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
          //TODO: Remove
          [ImportAction.MOCK_LOADING]: (context, event) => {
            const self = this;
            setTimeout( () => self.importService.send(ImportEvent.LOADING_COMPLETE), 10);
          },
          [ImportAction.SHOW_IMPORT_TYPE]: (context, event) => {
            this.showImportType();
          },
          [ImportAction.MAPPING_STARTED]: (context, event) => {
            this.startMapping();
          },
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

    upload() {
      // TODO: Upload to upload service
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
      this.showMapping = true;
    }

  }

  //TODO:
  // - Define the endpoints needed
  // - Create mock services and daos
  // - Create germplasm upload config in service
  // - Create fake file upload in service
  // - Implement mapping. Print out results when it is sent to dao layer
  // - Create phenotyping upload config in service
</script>

<style scoped>

</style>