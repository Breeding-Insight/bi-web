<!--
  - See the NOTICE file distributed with this work for additional information
  - regarding copyright ownership.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <div class="germplasm">
    <router-link
        v-bind:to="germplasmListsRoute()"
    >
      <a>&lt; Germplasm Lists</a>
    </router-link>
    <h1 class="title">
      {{ list ? list.listName : "" }}
    </h1>

    <GermplasmListDeletionModal
        v-bind:active="deleteModalActive"
        v-bind:list-db-id="listDbId"
        v-bind:modal-title="`Delete ${list.listName}`"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
        v-on:deactivate="deleteModalActive = false"
        v-on:list-deleted="deleteSuccess"
    />
    <FormModal
        v-bind:active.sync="downloadModalActive"
        v-bind:title="`Download ${list ? list.listName : ''}`"
        v-on:deactivate="closeDownloadModal"
    >
      <template #form>
        <fieldset>
          <legend class="label">
            File Formnat
          </legend>
          <div
              v-for="option in fileOptions"
              v-bind:key="option.id"
          >
            <label class="radio">
              <input
                  v-model="fileExtension"
                  type="radio"
                  name="fileType"
                  v-bind:value="option.id"
              ><span class="check" />
              <span class="control-label"> {{ option.name }} </span>
            </label>
          </div>
        </fieldset>
      </template>
      <template #buttons>
        <div class="columns">
          <div class="column is-whole has-text-centered buttons">
            <button
                class="button is-primary has-text-weight-bold"
                v-on:click="invokeDownload"
            >
              <strong>Download</strong>
            </button>
            <button
                class="button"
                v-on:click="closeDownloadModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </FormModal>
    <div class="columns">
      <div class="column is-10">
        <div class="columns is-multiline">
          <div class="column germplasm-list-meta-field"><b>Description:</b></div>
          <div class="column germplasm-list-meta-data">{{ list ? list.listDescription : ""}}</div>
          <div class="column germplasm-list-meta-field"><b>User:</b></div>
          <div class="column germplasm-list-meta-data">{{ list ? list.listOwnerName : ""}}</div>
          <div class="column germplasm-list-meta-field"><b>Import Date:</b></div>
          <div class="column germplasm-list-meta-data">{{ toYMD(list ? list.dateCreated : "") }}</div>
          <div class="column germplasm-list-meta-field"><b>Total Entries:</b></div>
          <div class="column germplasm-list-meta-data">{{ list ? list.listSize : ""}}</div>
        </div>
      </div>
      <div class="column is-2">
        <div class="columns is-multiline">
          <div class="column is-full"></div>
          <div class="column is-full"></div>
          <div class="column is-full"></div>
          <div class="column is-full buttons">
            <ActionMenu
                class = "is-pulled-right has-text-weight-bold above-tabs-button"
                v-bind:is-primary="true"
                v-bind:id="'manage-germplasm-list-dropdown-button'"
                v-bind:button-text="'Manage List'"
                v-bind:action-menu-items=actions
                v-on:delete-list="deleteList()"
                v-on:download-file="openDownloadModal()"
            >
            </ActionMenu>
          </div>
        </div>
      </div>
    </div>
    <GermplasmTable
        v-bind:germplasmFetch="germplasmFetch"
        entryNumberVisible="true"
        v-bind:reference-id="referenceId"
    >
    </GermplasmTable>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator'
import GermplasmBase from "@/components/germplasm/GermplasmBase.vue";
import GermplasmTable from '@/components/germplasm/GermplasmTable.vue';
import {GermplasmListSortField, GermplasmSort, SortOrder, GermplasmSortField} from '@/breeding-insight/model/Sort';
import {BiResponse} from '@/breeding-insight/model/BiResponse';
import {PaginationQuery} from '@/breeding-insight/model/PaginationQuery';
import {mapGetters} from 'vuex';
import {Program} from '@/breeding-insight/model/Program';
import {StringFormatters} from "@/breeding-insight/utils/StringFormatters";
import GermplasmDownloadButton from '@/components/germplasm/GermplasmDownloadButton.vue';
import GermplasmListDeletionModal from '@/components/germplasm/GermplasmListDeletionlModal.vue'
import {PaginationController} from "@/breeding-insight/model/view_models/PaginationController";
import ActionMenu from "@/components/layouts/menus/ActionMenu.vue";
import {ActionMenuItem} from "@/breeding-insight/model/ActionMenuItem";
import {FileTypeOption} from '@/breeding-insight/model/FileTypeOption';
import FormModal from "@/components/modals/FormModal.vue";
import {ListService} from '@/breeding-insight/service/ListService';
import {ListType} from "@/util/ListType";
import {GermplasmFilter} from "@/breeding-insight/model/ListFilter";
import {GermplasmService} from "@/breeding-insight/service/GermplasmService";

@Component({
  components: { FormModal, GermplasmTable, GermplasmDownloadButton, GermplasmListDeletionModal, ActionMenu },
  computed: {
    ...mapGetters([
      'activeProgram'
    ])
  }
})
export default class GermplasmByList extends GermplasmBase {

  private activeProgram?: Program;
  private downloadModalActive: boolean = false;
  private deleteModalActive: boolean = false;
  private fileOptions: FileTypeOption[] = Object.values(FileTypeOption);
  private fileExtension: string = this.fileOptions[0].id;
  private list: any = {};
  private referenceId?: string = '';
  private actions: ActionMenuItem[] = [
    new ActionMenuItem('germplasm-list-delete', 'delete-list', 'Delete', this.$ability.can('delete', 'List')),
    new ActionMenuItem('germplasm-list-download-file', 'download-file', 'Download',  true)
  ];

  // Formatting filters
  private toYMD(date: string | null | undefined): string {
    if (!date) return ''; // Return an empty string if date is null, undefined, or empty
    return date.split('T')[0];
  }
  private toStartCase(data: string): string | undefined {
    return StringFormatters.toStartCase(data);
  }

  // Breadcrumb route
  private germplasmListsRoute() {
    if (this.activeProgram && this.activeProgram.id) {
      return {name: 'germplasm-lists', params: {programId: this.activeProgram.id}};
    } else {
      return {name: 'germplasm-lists'};
    }
  }


  // Set the method used to populate the germplasm table
  private germplasmFetch = (
      programId: string,
      sort: GermplasmSort,
      { pageSize, currentPage }: PaginationController
  ) => (filters: any): Promise<BiResponse> =>
      GermplasmService.getAllInList<GermplasmSortField>(
          programId,
          sort,
          { pageSize, page: currentPage - 1 },
          { listDbId: this.$route.params.listId, ...filters }
      );


  mounted() {
    this.getList();
  }

  get listDbId(): string {
    return this.$route.params.listId;
  }

  private deleteSuccess() {
    // Navigate to the lists table since this list no longer exists
    this.$router.push({ name: "germplasm-lists" });
  }

  async deleteList() {
    this.deleteModalActive = true;
  }

  async openDownloadModal() {
    this.downloadModalActive = true;
  }

  private closeDownloadModal() {
    // Close the modal
    this.downloadModalActive = false;

    // Reset fileExtension.
    this.fileExtension = this.fileOptions[0].id;

  }

  private downloadList(): boolean {
    if (this.activeProgram) {
      window.open(process.env.VUE_APP_BI_API_ROOT + '/v1/programs/' + this.activeProgram.id + '/germplasm/export?fileExtension=' + this.fileExtension + '&list=' + this.listDbId, '_blank');
      return true;
    }
    return false;
  }

  private invokeDownload(){
    // Invoke the download prop, which returns true if download succeeded.
    if (this.downloadList())
    {
      // Close and deactivate modal.
      this.closeDownloadModal();
    }
  }

  async getList() {
    const {result: {data: lists}} = await ListService.getLists<GermplasmListSortField>(
        ListType.GERMPLASM,
        this.activeProgram!.id!,
        { field: GermplasmListSortField.Name, order: SortOrder.Descending },
        new PaginationQuery(0, 200, true));
    const matchingLists: any[] = lists.filter((list: any) => list.listDbId === this.$route.params.listId);
    this.list = matchingLists[0];

    // Find the key used, if any, for this list in the list entry numbers map
    this.referenceId = matchingLists[0].externalReferences.reduce((result: string, ref: any) => {
      return ref.referenceSource == `${process.env.VUE_APP_BI_REFERENCE_SOURCE}/lists` ? ref.referenceID : result;
    },'');
  }
}
</script>
