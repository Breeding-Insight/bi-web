<template>
  <div class="columns is-multiline is-mobile is-vcentered">
    <div class="column is-2"></div>
    <div class="column is-5">
      <span class="is-pulled-left has-text-weight-bold is-size-4">Ontology Term</span>
    </div>
    <div class="column is-5">
      <input id="newTermActiveToggle"
             type="checkbox"
             name="newTermActiveToggle"
             class="is-pulled-right switch is-rtl is-rounded"
             v-bind:value="trait.active"
             v-on:input="trait.active = !trait.active"
             checked="checked">
      <label for="newTermActiveToggle" class="is-pulled-right">{{trait.active ? 'Active' : 'Archived'}}</label>
    </div>

<!--    term name-->
    <div class="column is-2">
      <span class="is-pulled-right">Name</span>
    </div>
    <div class="column is-10 py-0">
      <BasicInputField
          class="required p-0"
          v-bind:value="trait.observationVariableName"
          v-bind:field-name="'Name'"
          v-bind:placeholder="'Ontology Term Name'"
          v-bind:show-label="false"
          v-bind:validations="clientValidations.observationVariableName"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ObservationVariableName)"
          v-on:input="setOTName($event)"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Full Name</span>
    </div>
    <div class="column is-10 py-0">
      <BasicInputField
          class="p-0"
          v-bind:value="fullName"
          v-bind:field-name="'Full name'"
          v-bind:placeholder="'Full Name'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.FullName)"
          v-on:input="setFullName($event)"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Description</span>
    </div>
    <div class="column is-10 py-0">
      <BasicInputField
          class="required p-0"
          v-bind:value="trait.traitDescription"
          v-bind:field-name="'Description'"
          v-bind:placeholder="'Ontology Term Description'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.TraitDescription)"
          v-on:input="trait.traitDescription = $event"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Synonyms</span>
    </div>
    <div class="column is-10 py-0">
      <BaseFieldWrapper class="p-0" fieldName="Synonyms" show-label="false">
        {{ trait.synonyms ? trait.synonyms.join(', ') : '' }}
      </BaseFieldWrapper>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Tags</span>
    </div>
    <div class="column is-10 py-0">
      <TagField
          class="p-0"
          v-bind:options="tags"
          v-bind:value.sync="trait.tags"
          v-bind:field-name="'Tags'"
          v-bind:show-label="false"
          v-bind:before-adding="checkTag"
          v-on:add="addTag($event)"
          v-on:remove="removeTag($event)"
      />
    </div>

    <!--    trait-->
    <div class="column is-2">
    </div>
    <div class="column is-10 py-0">
      <span class="has-text-weight-bold">Trait = Entity + Attribute = {{ traitName }}</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Entity</span>
    </div>
    <div class="column is-10 py-0">
      <AutoCompleteField
          class="required p-0"
          v-bind:options="entities"
          v-bind:value="trait.programObservationLevel ? trait.programObservationLevel.name : undefined"
          v-bind:field-name="'Entity'"
          v-bind:show-label="false"
          v-bind:validations="clientValidations.entity"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.Entity)"
          v-on:input="setObservationLevel($event)"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Attribute</span>
    </div>
    <div class="column is-10 py-0">
      <AutoCompleteField
          class="required p-0"
          v-bind:options="attributes"
          v-bind:value="trait.attribute"
          v-bind:field-name="'Attribute'"
          v-bind:show-label="false"
          v-bind:validations="clientValidations.attribute"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.Attribute)"
          v-on:input="trait.attribute = $event"
      />
    </div>

    <!--    method-->
    <div class="column is-2">
    </div>
    <div class="column is-10 py-0">
      <span class="has-text-weight-bold">Method = Description + Class = {{ methodName }}</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Description</span>
    </div>
    <div class="column is-10 py-0">
      <AutoCompleteField
          class="required p-0"
          v-bind:options="descriptions"
          v-bind:value="trait.method.description"
          v-bind:field-name="'Description'"
          v-bind:show-label="false"
          v-bind:validations="clientValidations.method.description"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodDescription)"
          v-on:input="trait.method.description = $event"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Class</span>
    </div>
    <div class="column is-10 py-0">
      <BasicSelectField
          class="required p-0"
          v-bind:selected-id="trait.method.methodClass"
          v-bind:options="methodOptions"
          v-bind:field-name="'Class'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodClass)"
          v-on:input="setMethodClass($event)"
      />
    </div>

    <!--    scale-->
    <div class="column is-2">
    </div>
    <div class="column is-10 py-0">
      <span class="has-text-weight-bold">Scale</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right">Class</span>
    </div>
    <div class="column is-10 py-0">
      <BasicSelectField
          class="required p-0"
          v-bind:selected-id="StringFormatters.toStartCase(trait.scale.dataType)"
          v-bind:options="getScaleOptions()"
          v-bind:field-name="'Class'"
          v-bind:show-label="false"
          v-bind:field-help="'Note: additional options for this field will appear after selection'"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ScaleType)"
          v-on:input="setScaleClass($event)"
      />
    </div>

      <!-- Formula -->
    <template v-if="trait.method && trait.method.methodClass === MethodClass.Computation">
      <div class="column is-2">
        <span class="is-pulled-right">Formula</span>
      </div>
      <div class="column is-10 py-0">
        <BasicInputField
            class="p-0"
            v-bind:value="trait.method.formula"
            v-bind:field-name="'Formula'"
            v-bind:show-label="false"
            v-bind:field-help="'Operations accepted: *^.+/(); calculations will use FOIL order of operations.'"
            v-bind:placeholder="'Number of flowers on single plant / 100'"
            v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodFormula)"
            v-on:input="trait.method.formula = $event"
        />
      </div>
    </template>

    <!-- Scale options -->
    <template
        v-if="trait.scale && (Scale.dataTypeEquals(trait.scale.dataType, DataType.Ordinal) || Scale.dataTypeEquals(trait.scale.dataType, DataType.Nominal))">
      <div class="column is-2">
        <span class="is-pulled-right">Categories</span>
      </div>
      <div class="column is-10 py-0">
        <CategoryTraitForm
            class="p-0"
            v-bind:data="trait.scale.categories"
            v-on:update="setCategories($event)"
            v-bind:type="trait.scale.dataType"
            v-bind:validation-handler="validationHandler"
            v-bind:validation-index="0"
        />
      </div>
    </template>

<!--    text options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Text)">
      <div class="column is-2">
      </div>
      <div class="column is-10 py-0">
        <TextTraitForm class="p-0"/>
      </div>
    </template>

<!--    date options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Date)">
      <div class="column is-2">
      </div>
      <div class="column is-10 py-0">
        <DateTraitForm class="p-0"/>
      </div>
    </template>

<!--    duration options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Duration)">
      <div class="column is-2">
        <span class="is-pulled-right">Unit of Time</span>
      </div>
      <div class="column is-10 py-0">
        <DurationTraitForm
            class="p-0"
            v-bind:unit="trait.scale.scaleName"
            v-bind:valid-min="trait.scale.validValueMin"
            v-bind:valid-max="trait.scale.validValueMax"
            v-on:unit-change="trait.scale.scaleName = $event"
            v-on:min-change="trait.scale.validValueMin = $event"
            v-on:max-change="trait.scale.validValueMax = $event"
            v-bind:client-validations="clientValidations"
            v-bind:validation-handler="validationHandler"
            v-bind:validation-index="0"
        />
      </div>
    </template>

<!--    numerical options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Numerical)">
      <div class="column is-2">
        <span class="is-pulled-right"></span>
      </div>
      <div class="column is-10 py-0">
        <NumericalTraitForm
            class="p-0"
            v-bind:unit="trait.scale.scaleName"
            v-bind:decimal-places="trait.scale.decimalPlaces"
            v-bind:valid-min="trait.scale.validValueMin"
            v-bind:valid-max="trait.scale.validValueMax"
            v-on:unit-change="trait.scale.scaleName = $event"
            v-on:decimal-change="trait.scale.decimalPlaces = $event"
            v-on:min-change="trait.scale.validValueMin = $event"
            v-on:max-change="trait.scale.validValueMax = $event"
            v-on:show-error-notification="$emit('show-error-notification', $event)"
            v-bind:client-validations="clientValidations"
            v-bind:validation-handler="validationHandler"
            v-bind:validation-index="0"
        />
      </div>
    </template>

  </div>

<!--  <div class="columns is-multiline is-gapless">-->
<!--    <div class="column" v-bind:class="{'is-full': editFormat}">-->

<!--      &lt;!&ndash;Ontology Term&ndash;&gt;-->
<!--      <div class="columns">-->
<!--        <span class="column form-heading-toggle is-half">Ontology Term</span>-->
<!--        <div class="column is-half">-->
<!--          <input id="newTermActiveToggle"-->
<!--                 type="checkbox"-->
<!--                 name="newTermActiveToggle"-->
<!--                 class="switch is-rtl is-rounded"-->
<!--                 v-bind:value="trait.active"-->
<!--                 v-on:input="trait.active = !trait.active"-->
<!--                 checked="checked">-->
<!--          <label for="newTermActiveToggle">{{trait.active ? 'Active' : 'Archived'}}</label>-->
<!--        </div>-->
<!--      </div>-->
<!--      <BasicInputField-->
<!--          class="new-form-content required"-->
<!--          v-bind:value="trait.observationVariableName"-->
<!--          v-bind:field-name="'Name'"-->
<!--          v-bind:placeholder="'Ontology Term Name'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:validations="clientValidations.observationVariableName"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ObservationVariableName)"-->
<!--          v-on:input="setOTName($event)"-->
<!--      />-->
<!--      <BasicInputField-->
<!--          class="new-form-content"-->
<!--          v-bind:value="fullName"-->
<!--          v-bind:field-name="'Full name'"-->
<!--          v-bind:placeholder="'Full Name'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.FullName)"-->
<!--          v-on:input="setFullName($event)"-->
<!--      />-->
<!--      <BasicInputField-->
<!--          class="new-form-content required"-->
<!--          v-bind:value="trait.traitDescription"-->
<!--          v-bind:field-name="'Description'"-->
<!--          v-bind:placeholder="'Ontology Term Description'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.TraitDescription)"-->
<!--          v-on:input="trait.traitDescription = $event"-->
<!--      />-->

<!--      <BaseFieldWrapper class="new-form-content" fieldName="Synonyms" show-label="true">-->
<!--        {{ trait.synonyms ? trait.synonyms.join(', ') : '' }}-->
<!--      </BaseFieldWrapper>-->

<!--      &lt;!&ndash;    Tags&ndash;&gt;-->
<!--      <span class="new-form-content form-heading">Tags</span>-->
<!--      <TagField-->
<!--          class="new-form-content"-->
<!--          v-bind:options="tags"-->
<!--          v-bind:value.sync="trait.tags"-->
<!--          v-bind:field-name="'Tags'"-->
<!--          v-bind:show-label="false"-->
<!--          v-bind:before-adding="checkTag"-->
<!--          v-on:add="addTag($event)"-->
<!--          v-on:remove="removeTag($event)"-->
<!--      />-->
<!--    </div>-->
<!--    <div class="divider is-vertical"/>-->
<!--    <div class="column" v-bind:class="{'is-full': editFormat}">-->
<!--      &lt;!&ndash;    Trait&ndash;&gt;-->
<!--      <span class="new-form-content form-heading">Trait = Entity + Attribute = {{ traitName }}</span>-->
<!--      <AutoCompleteField-->
<!--          class="new-form-content required"-->
<!--          v-bind:options="entities"-->
<!--          v-bind:value="trait.programObservationLevel ? trait.programObservationLevel.name : undefined"-->
<!--          v-bind:field-name="'Entity'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:validations="clientValidations.entity"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.Entity)"-->
<!--          v-on:input="setObservationLevel($event)"-->
<!--      />-->
<!--      <AutoCompleteField-->
<!--          class="new-form-content required"-->
<!--          v-bind:options="attributes"-->
<!--          v-bind:value="trait.attribute"-->
<!--          v-bind:field-name="'Attribute'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:validations="clientValidations.attribute"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.Attribute)"-->
<!--          v-on:input="trait.attribute = $event"-->
<!--      />-->


<!--      &lt;!&ndash;Method&ndash;&gt;-->
<!--      <span class="new-form-content form-heading">Method = Description + Class = {{ methodName }}</span>-->
<!--      <AutoCompleteField-->
<!--          class="new-form-content required"-->
<!--          v-bind:options="descriptions"-->
<!--          v-bind:value="trait.method.description"-->
<!--          v-bind:field-name="'Description'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:validations="clientValidations.method.description"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodDescription)"-->
<!--          v-on:input="trait.method.description = $event"-->
<!--      />-->
<!--      <BasicSelectField-->
<!--          class="new-form-content required"-->
<!--          v-bind:selected-id="trait.method.methodClass"-->
<!--          v-bind:options="methodOptions"-->
<!--          v-bind:field-name="'Class'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodClass)"-->
<!--          v-on:input="setMethodClass($event)"-->
<!--      />-->

<!--      <div class="new-form-divider"></div>-->

<!--      &lt;!&ndash;    Scale&ndash;&gt;-->
<!--      <span class="new-form-content form-heading">Scale</span>-->
<!--      <BasicSelectField-->
<!--          class="new-form-content required"-->
<!--          v-bind:selected-id="StringFormatters.toStartCase(trait.scale.dataType)"-->
<!--          v-bind:options="getScaleOptions()"-->
<!--          v-bind:field-name="'Class'"-->
<!--          v-bind:show-label="true"-->
<!--          v-bind:field-help="'Note: additional options for this field will appear after selection'"-->
<!--          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ScaleType)"-->
<!--          v-on:input="setScaleClass($event)"-->
<!--      />-->
<!--      &lt;!&ndash; Formula &ndash;&gt;-->
<!--      <template v-if="trait.method && trait.method.methodClass === MethodClass.Computation">-->
<!--        <BasicInputField-->
<!--            class="new-form-content"-->
<!--            v-bind:value="trait.method.formula"-->
<!--            v-bind:field-name="'Formula'"-->
<!--            v-bind:field-help="'Operations accepted: *^.+/(); calculations will use FOIL order of operations.'"-->
<!--            v-bind:placeholder="'Number of flowers on single plant / 100'"-->
<!--            v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodFormula)"-->
<!--            v-on:input="trait.method.formula = $event"-->
<!--        />-->
<!--      </template>-->
<!--      &lt;!&ndash; Scale options &ndash;&gt;-->
<!--      <template-->
<!--          v-if="trait.scale && (Scale.dataTypeEquals(trait.scale.dataType, DataType.Ordinal) || Scale.dataTypeEquals(trait.scale.dataType, DataType.Nominal))">-->
<!--        <CategoryTraitForm-->
<!--            class="new-form-content"-->
<!--            v-bind:data="trait.scale.categories"-->
<!--            v-on:update="setCategories($event)"-->
<!--            v-bind:type="trait.scale.dataType"-->
<!--            v-bind:validation-handler="validationHandler"-->
<!--            v-bind:validation-index="0"-->
<!--        />-->
<!--      </template>-->
<!--      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Text)">-->
<!--        <TextTraitForm class="new-form-content"/>-->
<!--      </template>-->
<!--      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Date)">-->
<!--        <DateTraitForm class="new-form-content"/>-->
<!--      </template>-->
<!--      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Duration)">-->
<!--        <DurationTraitForm-->
<!--            class="new-form-content"-->
<!--            v-bind:unit="trait.scale.scaleName"-->
<!--            v-bind:valid-min="trait.scale.validValueMin"-->
<!--            v-bind:valid-max="trait.scale.validValueMax"-->
<!--            v-on:unit-change="trait.scale.scaleName = $event"-->
<!--            v-on:min-change="trait.scale.validValueMin = $event"-->
<!--            v-on:max-change="trait.scale.validValueMax = $event"-->
<!--            v-bind:client-validations="clientValidations"-->
<!--            v-bind:validation-handler="validationHandler"-->
<!--            v-bind:validation-index="0"-->
<!--        />-->
<!--      </template>-->
<!--      <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Numerical)">-->
<!--        <NumericalTraitForm-->
<!--            class="new-form-content"-->
<!--            v-bind:unit="trait.scale.scaleName"-->
<!--            v-bind:decimal-places="trait.scale.decimalPlaces"-->
<!--            v-bind:valid-min="trait.scale.validValueMin"-->
<!--            v-bind:valid-max="trait.scale.validValueMax"-->
<!--            v-on:unit-change="trait.scale.scaleName = $event"-->
<!--            v-on:decimal-change="trait.scale.decimalPlaces = $event"-->
<!--            v-on:min-change="trait.scale.validValueMin = $event"-->
<!--            v-on:max-change="trait.scale.validValueMax = $event"-->
<!--            v-on:show-error-notification="$emit('show-error-notification', $event)"-->
<!--            v-bind:client-validations="clientValidations"-->
<!--            v-bind:validation-handler="validationHandler"-->
<!--            v-bind:validation-index="0"-->
<!--        />-->
<!--      </template>-->

<!--      <div class="new-form-divider"></div>-->

<!--    </div>-->
<!--  </div>-->
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method, MethodClass} from "@/breeding-insight/model/Method";
import { Scale, DataType } from '@/breeding-insight/model/Scale';
import { ProgramObservationLevel } from '@/breeding-insight/model/ProgramObservationLevel';
import OrdinalTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";
import TextTraitForm from "@/components/trait/forms/TextTraitForm.vue";
import DateTraitForm from "@/components/trait/forms/DateTraitForm.vue";
import DurationTraitForm from "@/components/trait/forms/DurationTraitForm.vue";
import NumericalTraitForm from "@/components/trait/forms/NumericalTraitForm.vue";
import CategoryTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";
import {TraitError} from "@/breeding-insight/model/errors/TraitError";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import { StringFormatters } from '@/breeding-insight/utils/StringFormatters';
import {Category} from "@/breeding-insight/model/Category";
import {integer} from "vuelidate/lib/validators";
import TagField from "@/components/forms/TagField.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";

@Component({
  components: {
    TagField,
    AutoCompleteField,
    CategoryTraitForm,
    NumericalTraitForm,
    BaseFieldWrapper,
    DurationTraitForm, DateTraitForm, TextTraitForm, OrdinalTraitForm, BasicSelectField, BasicInputField},
  data: () => ({DataType, MethodClass, TraitError, StringFormatters, Scale})
})
export default class BaseTraitForm extends Vue {
  @Prop()
  programObservationLevels?: string[];
  @Prop()
  entities?: string[];
  @Prop()
  descriptions?: string[];
  @Prop()
  attributes?: string[];
  @Prop()
  methodOptions?: string[];
  @Prop()
  scaleOptions?: string[];
  @Prop()
  clientValidations: any;
  @Prop()
  validationHandler!: ValidationError;
  @Prop({default: () => new Trait()})
  trait!: Trait;
  @Prop({default: false})
  editFormat!: boolean;
  @Prop()
  tags?: string[];

  fullName: string = '';
  private methodHistory: {[key: string]: Method} = {};
  private scaleHistory: {[key: string]: Scale} = {};
  private lastCategoryType: string = '';

  get traitName(): string {
    let entity = this.trait.entity || '';
    let attribute = this.trait.attribute || '';
    return `${entity} ${attribute}`;
  }

  get methodName(): string {
    let description = '';
    let methodClass = '';
    if (this.trait.method && this.trait.method.description) {
      description = this.trait.method.description;
    }
    if (this.trait.method && this.trait.method.methodClass) {
      methodClass = this.trait.method.methodClass;
    }
    return `${description} ${methodClass}`;
  }

  created() {
    if (!this.trait.method) {
      this.trait.method = new Method();
    }
    if (!this.trait.scale){
      this.trait.scale = new Scale();
    }
  }

  @Watch('trait', {deep: true})
  emitTrait(val: Trait) {
    this.$emit('trait-change', val);
  }

  getScaleOptions() {
    if (this.trait.method && this.trait.method!.methodClass === MethodClass.Computation) {
      return [DataType.Numerical];
    } else {
      return this.scaleOptions;
    }
  }

  setMethodClass(value: string) {
    // Save our current method
    if (this.trait!.method!.methodClass) {
      this.methodHistory[this.trait!.method!.methodClass] = {...this.trait!.method!} as Method;
    }

    // Set the new method class and get formula history if available
    this.trait!.method!.methodClass = value;
    if (this.methodHistory[value]) {
      this.trait.method!.formula = this.methodHistory[value].formula;
    } else {
      this.trait.method!.formula = undefined;
    }

    // Computation method class is always numerical
    if (this.trait!.method!.methodClass === MethodClass.Computation) {
      this.setScaleClass(DataType.Numerical);
    }
  }

  setScaleClass(value: string) {
    // Save history of current scale class
    if (this.trait.scale!.dataType) {
      this.scaleHistory[this.trait.scale!.dataType.toLowerCase()] = Scale.assign({...this.trait.scale!} as Scale);
      if (Scale.dataTypeEquals(this.trait!.scale!.dataType, DataType.Nominal) || Scale.dataTypeEquals(this.trait!.scale!.dataType, DataType.Ordinal)) {
        this.lastCategoryType = this.trait!.scale!.dataType;
      }
    }

    if (Scale.dataTypeEquals(value, DataType.Nominal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Ordinal)) {
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Ordinal.toLowerCase()]);
      // Clear the scale category validations if there are any, the switch is confusing
      this.validationHandler.clearValidation(0, 'scale.categories');

      // Clear the values, use labels as the new values if they exist
      if (this.trait.scale.categories) {
        this.trait.scale.categories.forEach(category => {
          category.value = category.label;
          category.label = undefined;
        });
      }

      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;
    } else if (Scale.dataTypeEquals(value, DataType.Ordinal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Nominal)) {
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Nominal.toLowerCase()]);
      // Clear the scale category validations if there are any, the switch is confusing
      this.validationHandler.clearValidation(0, 'scale.categories');

      // Add 1-based index values to categories
      if (this.trait.scale.categories) {
        this.trait.scale.categories.forEach((category, index, categories) => {
          // Use prior values if they exist
          const historicalCats: Category[] = this.scaleHistory[DataType.Ordinal.toLowerCase()] ? this.scaleHistory[DataType.Ordinal.toLowerCase()].categories as Category[] : [] as Category[];
          // Assign the value in the label place for the switch back to ordinal
          category.label = category.value;
          if (historicalCats[index] && historicalCats[index].value) {
              category.value = historicalCats[index].value;
          } else {
            const autoValue: string = index + 1 + '';
            category.value = autoValue;
          }
        });
      }
      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;

    } else if (this.scaleHistory[value.toLowerCase()]) {
      this.trait.scale = this.scaleHistory[value.toLowerCase()];
      this.trait.scale.dataType = value;
      this.trait!.scale!.scaleName = value;

    } else {
      // No history
      this.trait.scale = new Scale();
      this.trait.scale.dataType = value;

      // Allow for units in the numerical and duration traits
      if (Scale.dataTypeEquals(value, DataType.Numerical) || Scale.dataTypeEquals(value, DataType.Duration)) {
        this.trait!.scale!.scaleName = undefined;

      } else {
        this.trait!.scale!.scaleName = value;
      }
    }
  }

  setCategories(categories: Category[]) {
    this.trait.scale!.categories = categories;
    this.emitTrait(this.trait);
  }

  setObservationLevel(value: string) {
    this.trait!.programObservationLevel = new ProgramObservationLevel(value);
    this.trait!.entity = this.trait!.programObservationLevel.name;
  }

  setAbbreviations(value: string) {
    const abbreviations = this.parseSemiColonList(value);
    this.trait.abbreviations = abbreviations;
    if (abbreviations.length > 0) {this.trait.mainAbbreviation = this.trait.abbreviations[0]}
  }

  setOTName(value: string) {
    this.trait.observationVariableName = value;
    this.trait.synonyms = this.trait.synonyms || [];
    this.trait.synonyms[0] = value;
  }

  setFullName(value: string) {
    this.fullName = value;
    this.trait.synonyms = this.trait.synonyms || [];
    this.trait.synonyms[1] = value;
  }

  parseSemiColonList(value: string): string[] {
    return value.split(';');
  }
  addTag(tag: string) {
    // Check that the tag doesn't already exist
    this.trait.addTag(tag.toLowerCase());
  }
  removeTag(tag: string) {
    this.trait.removeTag(tag);
  }
  checkTag(tag: string): boolean {
    //TODO: Show an error if tag already exists?
    return !this.trait.hasTag(tag);
  }
}

</script>

<style scoped>

</style>
