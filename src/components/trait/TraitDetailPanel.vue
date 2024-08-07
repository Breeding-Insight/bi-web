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
  <div class="is-full-length trait-detail">
    <template v-if="data && !editActive">
      <p v-if="data.observationVariableName" class="is-size-5 has-text-weight-bold mb-0">
        {{data.observationVariableName}}
        <span v-if="!data.active" class="tag is-link is-normal ml-1">Archived</span>
      </p><br>

      <div v-if="data.fullName" class="columns is-desktop pt-1 pl-3">
        <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
          <span class="has-text-weight-bold">Full Name</span>
        </div>
        <div class="column pt-0 pb-0">
          <span class="is-size-7 mb-0">{{data.fullName}}</span>
        </div>
      </div>

      <div v-if="data.traitDescription" class="columns is-desktop pt-1 pl-3">
        <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
          <span class="has-text-weight-bold">Description</span>
        </div>
        <div class="column pt-0 pb-0">
          <span class="is-size-7 mb-0">{{data.traitDescription}}</span>
        </div>
      </div>

      <div v-if="data.termType" class="columns is-desktop pt-1 pl-3">
        <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
          <span class="has-text-weight-bold">Term Type</span>
        </div>
        <div class="column pt-0 pb-0">
          <span class="is-size-7 mb-0">{{TraitStringFormatters.getTermTypeString(data.termType)}}</span>
        </div>
      </div>

      <!-- just shows first abbreviation AKA main abbreviation and first synonym -->
      <template v-if="abbreviationsSynonymsString">
        <div class="columns is-desktop pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Synonyms</span>
          </div>
          <div class="column pt-0 pb-0">
            <span class="is-size-7 mb-0">{{ abbreviationsSynonymsString(2)}}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="mb-0"/>
      </template>

      <template v-if="data.tags && data.tags.length > 0">
        <div class="columns is-desktop pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Tags</span>
          </div>
          <div class="column pt-0 pb-0">
          <template v-for="tag in data.tags">
              <span v-bind:key="tag" class="tag is-info is-normal mr-1">{{ tag }}</span>
          </template>
          </div>
        </div>
      </template>

      <template v-if="data.entity && data.attribute">
        <div class="columns is-desktop pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Trait</span>
          </div>
          <div class="column pt-0 pb-0">
            <span class="is-size-7 display-case">{{ data.entity }} {{ data.attribute }}</span>
          </div>
        </div>
      </template>
      <template v-if="data.method && data.method.methodClass">
        <div class="columns is-desktop is-multiline-mobile pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Method</span>
          </div>
          <div class="column pt-0 pb-0">
            <span class="is-size-7 display-case">{{ data.method.description }} {{ data.method.methodClass }}</span>
          </div>
        </div>
      </template>

      <!-- if computation method, show formula as well -->
      <template v-if="methodClass && Method.methodClassEquals(methodClass, MethodClass.Computation)">
        <div class="columns is-desktop pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Formula</span>
          </div>
          <div class="column pt-0 pb-0">
            <span class="is-size-7">{{ valueOrNA(data.method.formula) }}</span>
          </div>
        </div>
      </template>

      <template v-if="data.scale && data.scale.dataType">
        <div class="columns is-desktop pt-1 pl-3">
          <div class="column is-one-third pt-0 pb-0 has-text-right-desktop">
            <span class="has-text-weight-bold">Scale</span>
          </div>
          <div class="column pt-0 pb-0">
            <span class="is-size-7">{{ scaleTypeString }}</span>
          </div>
        </div>
      </template>

      <div class="pt-3 pl-2 mb-6 scale-info" v-if="scaleType && (Scale.dataTypeEquals(scaleType, DataType.Ordinal) || Scale.dataTypeEquals(scaleType, DataType.Nominal) || Scale.dataTypeEquals(scaleType, DataType.Numerical))">
        <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Numerical)">
          <div class="columns is-desktop">
            <div class="column is-one-third">
              <span class="has-text-weight-bold">Units</span>
            </div>
            <div class="column">
              <span class="is-size-7">{{ valueOrNA(data.scale.scaleName) | capitalize }}</span>
            </div>
          </div>
          <div class="columns is-desktop">
            <div class="column is-one-third">
              <span class="has-text-weight-bold">Decimals</span>
            </div>
            <div class="column">
              <span class="is-size-7">{{ valueOrNA(data.scale.decimalPlaces) }}</span>
            </div>
          </div>
          <div class="columns is-desktop">
            <div class="column is-one-third">
              <span class="has-text-weight-bold">Min</span>
            </div>
            <div class="column">
              <span class="is-size-7">{{ valueOrNA(data.scale.validValueMin) }}</span>
            </div>
          </div>
          <div class="columns is-desktop">
            <div class="column is-one-third">
              <span class="has-text-weight-bold">Max</span>
            </div>
            <div class="column">
              <span class="is-size-7">{{ valueOrNA(data.scale.validValueMax) }}</span>
            </div>
          </div>
        </template>
        <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Text)">
          <!-- TODO: Not showing anything for this now -->
        </template>

        <!--        nothing to show for date class now-->
        <template v-if="scaleType && Scale.dataTypeEquals(scaleType, DataType.Date)">
        </template>


        <!-- scale types hardcoded for now until we can get them from bi-api -->
        <template
            v-if="scaleType && (Scale.dataTypeEquals(scaleType, DataType.Ordinal) || Scale.dataTypeEquals(scaleType, DataType.Nominal))">
          <div v-for="category in data.scale.categories"
               :key="category.label"
               class="columns is-mobile is-vcentered scale-categories">
            <div class="column is-one-third-desktop is-one-quarter-mobile" v-if="Scale.dataTypeEquals(scaleType, DataType.Ordinal)">
              <span>{{ category.value }}</span>
            </div>
            <div class="column is-narrow" v-if="Scale.dataTypeEquals(scaleType, DataType.Ordinal)">
              <span>=</span>
            </div>
            <div class="column">
              <span v-if="category.label">{{ category.label }}</span>
              <span v-else>{{ category.value }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- maybe break out controls for reuse eventually -->
      <div v-if="!isSubscribed" class="columns is-centered is-mobile is-variable is-multiline is-0 my-0">
        <div class="column is-half p-0 mt-5">
          <!-- editable && !loadingEditable && -->
          <a
              v-if="!data.isDup"
              v-on:click="$emit('activate-edit', data)"
              v-on:keypress.enter.space="$emit('activate-edit', data)"
              tabindex="0"
              class="is-pulled-right mr-2"
          >
            Edit
          </a>
        </div>
        <div class="column is-half p-0"></div>
      </div>

      <!--
      <ProgressBar v-if="loadingEditable && $ability.can('update', 'Trait')" v-bind:label="'Checking trait editability status'"
                   v-bind:estimated-time-text="'May take a few seconds'"
      />
      -->

      <!--
      <article v-if="!editable && !loadingEditable && !fromImportTable && $ability.can('update', 'Trait')" class="message is-info">
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
      -->
    </template>

    <template v-if="data && editActive">
      <EditDataForm
        v-on:cancel="$emit('deactivate-edit')"
        v-on:submit="$emit('submit')"
        v-bind:row-validations="clientValidations"
        v-bind:record.sync="editTrait"
        v-bind:data-form-state="editFormState"
        v-on:show-error-notification="$emit('show-error-notification', $event)"
      >
        <template v-slot="validations">
          <BaseTraitForm
              v-bind:trait.sync="editTrait"
              v-bind:edit-format="true"
              v-on:trait-change="traitUpdate($event)"
              v-on:archive="$emit('archive', $event)"
              v-on:restore="$emit('restore', $event)"
              v-bind:tags="tags"
              v-bind:scale-options="scaleClassOptions"
              v-bind:method-options="methodClassOptions"
              v-bind:descriptions="descriptionOptions"
              v-bind:program-observation-levels="observationLevelOptions"
              v-bind:entities="entityOptions"
              v-bind:attributes="attributeOptions"
              v-bind:client-validations="validations"
              v-bind:validation-handler="validationHandler"
              v-bind:editable="false"
              v-bind:editable-check-loading="true"
          ></BaseTraitForm>
        </template>
      </EditDataForm>
    </template>
  </div>
</template>

<script lang="ts">

  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {mapGetters} from 'vuex'
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
  import {TraitStringFormatters} from '@/breeding-insight/utils/TraitStringFormatters';

  @Component({
    components: {EditDataForm, SidePanel, BaseTraitForm, HelpCircleIcon, ProgressBar},
    computed: {
      ...mapGetters('programManagement',[
        'isSubscribed'
      ])
    },
    data: () => ({DataType, MethodClass, Scale, Method, StringFormatters, TraitStringFormatters}),
    filters: {
      capitalize: function(value: string | undefined) : string | undefined {
        if (value === undefined) value = '';
        return StringFormatters.toStartCase(value);
      }
    }
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
    @Prop({default: false})
    private fromImportTable!: boolean;


    private editTrait: Trait | null = null;
    private scalePostfix = new Set<string>().add(DataType.Ordinal).add(DataType.Nominal);

    // Variables for edit form
    private methodClassOptions: string[] = Object.values(MethodClass);
    private scaleClassOptions: string[] = Object.values(DataType);

    @Watch('editActive', {immediate: true})
    watchEdit() {
      if (this.editActive){
        this.editTrait = Trait.assign({...this.data} as Trait);
        //For nominal, switch value and label for ease of display
        if ((this.editTrait.scale) && (this.editTrait.scale.dataType) && (Scale.dataTypeEquals(this.editTrait.scale.dataType, DataType.Nominal)) && (this.editTrait.scale.categories)) {
          this.editTrait.scale.categories.forEach(category => {
            category.label = category.value;
            category.value = undefined;
          });
        }
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
      if (this.data && this.data.scale) {
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

