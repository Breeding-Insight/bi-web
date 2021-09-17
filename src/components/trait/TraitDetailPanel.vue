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
  <div class="is-full-length">
    <template v-if="data && !editActive">
      <p v-if="data.observationVariableName" class="is-size-5 has-text-weight-bold mb-0">{{data.observationVariableName}}</p>
      <p v-if="data.traitDescription" class="is-size-7 mb-0">{{data.traitDescription}}</p>
      <!-- just shows first abbreviation AKA main abbreviation and first synonym -->
      <template v-if="abbreviationsSynonymsString">
        <p class="is-size-7 mb-0">{{ abbreviationsSynonymsString(2)}}</p>
      </template>
      <template v-else>
        <p class="mb-0"/>
      </template>

      <template v-if="data.tags && data.tags.length > 0">
        <p class="has-text-weight-bold mt-5 mb-0">Tags</p>
        <template v-for="tag in data.tags">
          <span v-bind:key="tag" class="tag is-primary is-normal mr-1">{{ tag }}</span>
        </template>
      </template>

      <template v-if="data.entity && data.attribute">
        <p class="has-text-weight-bold mt-5 mb-0">Trait</p>
        <p class="is-size-7 mb-0">{{`${data.entity} ${data.attribute}`}}</p>
      </template>

      <template v-if="data.method && data.method.description && data.method.methodClass">
        <p class="has-text-weight-bold mb-0">Method</p>
        <p  class="is-size-7 mb-0">{{`${data.method.description} ${data.method.methodClass}`}}</p>
      </template>

      <template>
        <p class="has-text-weight-bold mb-0">Scale</p>
        <p v-if="scaleTypeString" class="is-size-7 mb-0">{{scaleTypeString}}</p>
<!--        <p v-if="data.entity && data.attribute" class="is-size-7">{{`${data.entity} ${data.attribute}`}}</p>-->
      </template>


      <!-- scale types hardcoded for now until we can get them from bi-api -->
      <template v-if="scaleType && (Scale.dataTypeEquals(scaleType, DataType.Ordinal) || Scale.dataTypeEquals(scaleType, DataType.Nominal))">
        <p class="mb-0" v-for="category in data.scale.categories" :key="category.label">
          <template v-if="category.label">
            {{ category.label }} =
          </template>
          {{category.value}}
        </p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Text)">
        <!-- TODO: Not showing anything for this now -->
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Numerical)">
        <p class="mb-0">Units: {{valueOrNA(data.scale.scaleName)}}</p>
        <p class="mb-0">Decimal Places: {{valueOrNA(data.scale.decimalPlaces)}}</p>
        <p class="mb-0">Minimum valid value: {{valueOrNA(data.scale.validValueMin)}}</p>
        <p class="mb-0">Maximum valid value: {{valueOrNA(data.scale.validValueMax)}}</p>
      </template>

      <template v-if="Scale.dataTypeEquals(scaleType, DataType.Duration)">
        <p class="mb-0">Unit of time: {{valueOrNA(data.scale.scaleName)}}</p>
        <p class="mb-0">Minimum valid value: {{valueOrNA(data.scale.validValueMin)}}</p>
        <p class="mb-0">Maximum valid value: {{valueOrNA(data.scale.validValueMax)}}</p>
      </template>

      <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Date)">
      </template>

      <!-- if computation method, show formula as well -->
      <template v-if="methodClass && Method.methodClassEquals(methodClass, MethodClass.Computation)">
        <p class="has-text-weight-bold mt-3 mb-0">Formula</p>
        <p class="mb-0">{{valueOrNA(data.method.formula)}}</p>
      </template>

<!--      <p class="has-text-weight-bold mt-3 mb-0">Description of collection method</p>-->
<!--      <p>{{data.method.description}}</p>-->

      <ProgressBar v-if="loadingEditable && $ability.can('update', 'Trait')" v-bind:label="'Checking trait editability status'"
                   v-bind:estimated-time-text="'May take a few seconds'"
      />

      <article v-if="!editable && !loadingEditable && $ability.can('update', 'Trait')" class="message is-info">
        <div class="message-body">
          <div class="media">
            <figure class="media-left">
              <p class="image is-24x24">
                <help-circle-icon size="1.5x"></help-circle-icon>
              </p>
            </figure>
            <div class="media-content">
              <div class="has-text-dark">
                Not editable because this trait has associated experiment data.
              </div>
            </div>
          </div>
        </div>
      </article>

      <template v-if="!data.active">
        <p class="has-text-weight-bold mt-3 mb-0">Included in Favorites</p>
        <b-button
            size="is-small"
            style="background: lightgray"
            class="archive-tag"
            v-if="archivable && !data.active">
          Archived
        </b-button>
      </template>

      <!-- maybe break out controls for reuse eventually -->
      <div class="columns is-mobile is-centered pt-6">
        <div class="column is-narrow">
          <a
            v-if="editable && !loadingEditable"
            v-on:click="$emit('activate-edit', data)"
            v-on:keypress.enter.space="$emit('activate-edit', data)"
            tabindex="0"
          >
            Edit
          </a>
        </div>
        <div class="column is-narrow">
          <a
            v-if="archivable && data.active"
            v-on:click="$emit('archive', data)"
            v-on:keypress.enter.space="$emit('archive', data)"
            tabindex="0"
            >
            Archive
          </a>
          <a
            v-if="archivable && !data.active"
            v-on:click="$emit('restore', data)"
            v-on:keypress.enter.space="$emit('restore', data)"
            tabindex="0"
          >
            Restore/Unarchive
          </a>
        </div>
      </div>
    </template>
    <template v-if="data && editActive">
      <EditDataForm
        v-on:cancel="$emit('deactivate-edit')"
        v-on:submit="$emit('submit')"
        v-bind:row-validations="clientValidations"
        v-bind:edit-record.sync="editTrait"
        v-bind:data-form-state="editFormState"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
      >
        <template v-slot="validations">
          <BaseTraitForm
              v-bind:trait.sync="editTrait"
              v-bind:edit-format="true"
              v-on:trait-change="traitUpdate($event)"
              v-bind:tags="tags"
              v-bind:scale-options="scaleClassOptions"
              v-bind:method-options="methodClassOptions"
              v-bind:descriptions="descriptionOptions"
              v-bind:program-observation-levels="observationLevelOptions"
              v-bind:entities="entityOptions"
              v-bind:attributes="attributeOptions"
              v-bind:client-validations="validations"
              v-bind:validation-handler="validationHandler"
          ></BaseTraitForm>
        </template>
      </EditDataForm>
    </template>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import SidePanel from '@/components/tables/SidePanel.vue'
  import {Trait} from '@/breeding-insight/model/Trait'
  import {Scale, DataType} from '@/breeding-insight/model/Scale'
  import {Method, MethodClass} from '@/breeding-insight/model/Method'
  import {StringFormatters} from '@/breeding-insight/utils/StringFormatters'
  import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
  import BaseTraitForm from "@/components/trait/forms/BaseTraitForm.vue";
  import EditDataForm from "@/components/forms/EditDataForm.vue";
  import { DataFormEventBusHandler } from '@/components/forms/DataFormEventBusHandler';
  import { HelpCircleIcon } from 'vue-feather-icons'
  import ProgressBar from '@/components/forms/ProgressBar.vue'

  @Component({
    components: {EditDataForm, SidePanel, BaseTraitForm, HelpCircleIcon, ProgressBar},
    data: () => ({DataType, MethodClass, Scale, Method})
  })
  export default class TraitDetailPanel extends Vue {

    @Prop()
    private data!: Trait;
    @Prop()
    private observationLevelOptions!: string[];
    @Prop({default: false})
    private editActive!: boolean;
    @Prop()
    private editable!: boolean | undefined;
    @Prop({default: true})
    private loadingEditable!: boolean;
    @Prop({default: false})
    private archivable!: boolean;
    @Prop()
    private editFormState!: DataFormEventBusHandler
    @Prop()
    private clientValidations!: any | undefined;
    @Prop()
    private validationHandler!: ValidationError;
    @Prop()
    private tags!: string[];
    @Prop()
    private descriptionOptions?: string[];
    @Prop()
    private entityOptions?: string[];
    @Prop()
    private attributeOptions?: string[];


    private editTrait: Trait | null = null;
    private scalePostfix = new Set<string>().add(DataType.Ordinal).add(DataType.Nominal);

    // Variables for edit form
    private methodClassOptions: string[] = Object.values(MethodClass);
    private scaleClassOptions: string[] = Object.values(DataType);

    @Watch('editActive', {immediate: true})
    watchEdit() {
      if (this.editActive){
        this.editTrait = Trait.assign({...this.data} as Trait);
      } else {
        this.editTrait = null;
      }

    }

    public traitUpdate(trait: Trait) {
      this.editTrait = trait;
      this.$emit('trait-change', this.editTrait);
    }

    abbreviationsSynonymsString(synonymsMaxLength: number) : string | undefined {
      let abbSyn = "";
      if (this.data && this.data.abbreviations && this.data.abbreviations.length > 0) {
        abbSyn = this.data.abbreviations[0];
      }
      if (this.data && this.data.synonyms && this.data.synonyms.length > 0) {
        // Up to synonymsMaxLength synonyms will be shown before , ... cutoff
        const synonyms = this.data.synonyms.slice(0, Math.min(this.data.synonyms.length, synonymsMaxLength)).join(", ");
        abbSyn = (abbSyn === "") ? synonyms : abbSyn + ", " + synonyms;
        if (this.data.synonyms.length > synonymsMaxLength && this.data.synonyms.length !== 1) {
          abbSyn = abbSyn + ", ...";
        }
      }

      return abbSyn === "" ? undefined : abbSyn;
    }

    get scaleType() {
      if (this.data && this.data.scale && this.data.scale.dataType) {
        return this.data.scale.dataType;
      }
      return undefined;
    }

    get methodClass() {
      if (this.data && this.data.method && this.data.method.methodClass) {
        return this.data.method.methodClass;
      }
      return undefined;
    }

    get scaleTypeString() {
      if (this.data && this.data.programObservationLevel && this.data.method && this.data.scale) {
        let str = StringFormatters.toStartCase(this.data.scale.dataType!);
        const postfix = this.scalePostFix(this.data.scale.dataType!);
        if (postfix !== "") {
          str = str + " " + postfix;
        }
        return str;
      }
      return undefined;
    }

    scalePostFix(dataType: string) : string {
      if (this.scalePostfix.has(dataType.toUpperCase())) {
        return "Scale";
      } else if (Scale.dataTypeEquals(dataType, DataType.Numerical)) {
        return "Units";
      } else {
        return "";
      }
    }

    valueOrNA(value: any) {
      return value !== undefined ? value: "NA";
    }
    
  }
</script>

