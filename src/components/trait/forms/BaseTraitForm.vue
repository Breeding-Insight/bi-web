<template>
  <div class="columns is-multiline is-gapless is-vcentered">
    <div class="column is-2"></div>
    <div class="column is-5">
      <span class="is-pulled-left has-text-weight-bold is-size-4">Ontology Term</span>
    </div>
    <div class="column is-5">
      <input id="newTermActiveToggle"
             type="checkbox"
             name="newTermActiveToggle"
             class="is-pulled-right switch is-rtl is-rounded is-info"
             v-bind:checked="trait.active"
             v-on:input="toggleActiveState">
      <label for="newTermActiveToggle" class="is-pulled-right">{{trait.active ? 'Active' : 'Archived'}}</label>
    </div>

<!-- term type -->
  <div class="column is-2">
    <span class="is-pulled-right required new-term pb-2 pr-3">Term Type</span>
  </div>
  <div class="column new-term is-10">
    <BasicSelectField
        id="termTypeField"
        class="pb-2"
        v-bind:selected-id="trait.termType"
        v-bind:options="termTypes"
        v-bind:field-name="'Term Type'"
        v-bind:show-label="false"
        v-on:input="setTermType($event)"
    />
  </div>

<!--    term name-->
    <div class="column is-2">
      <span class="is-pulled-right required new-term pb-2 pr-3">Name</span>
    </div>
    <div class="column new-term is-10">
      <BasicInputField
          class="pb-2"
          v-bind:value="trait.observationVariableName"
          v-bind:field-name="'Name'"
          v-bind:placeholder="'Ontology Term Name'"
          v-bind:show-label="false"
          v-bind:field-help="''"
          v-bind:validations="clientValidations.observationVariableName"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ObservationVariableName)"
          v-on:input="setOTName($event)"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right new-term pb-2 pr-3">Full Name</span>
    </div>
    <div class="column new-term is-10">
      <BasicInputField
          class="pb-2"
          v-bind:value="trait.fullName"
          v-bind:field-name="'Full name'"
          v-bind:placeholder="'Full Name'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.FullName)"
          v-on:input="setFullName($event)"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right required new-term pb-2 pr-3">Description</span>
    </div>
    <div class="column new-term is-10">
      <BasicInputField
          class="pb-2"
          v-bind:value="trait.traitDescription"
          v-bind:field-name="'Description'"
          v-bind:placeholder="'Ontology Term Description'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.TraitDescription)"
          v-on:input="trait.traitDescription = $event"
      />
    </div>
    <div class="column is-2">
      <span class="is-pulled-right new-term pb-2 pr-3">Synonyms</span>
    </div>
    <div class="column new-term is-10">
      <BaseFieldWrapper class="pb-2" fieldName="Synonyms" v-bind:show-label="false">
        {{ trait.synonyms | toCSV }}
      </BaseFieldWrapper>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right new-term pb-1 pr-3">Tags</span>
    </div>
    <div class="column new-term is-10">
      <TagField
          id="tags"
          class="pt-1 pb-1"
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
    <div class="column is-2 mt-4">
    </div>
    <div class="column is-10 mt-4">
      <span class="has-text-weight-bold">Trait = Entity + Attribute {{ traitName }}</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right required new-term pb-2 pr-3">Entity</span>
    </div>
    <div class="column new-term is-10">
      <AutoCompleteField
          id="entity"
          class="pb-2"
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
      <span class="is-pulled-right required new-term pb-2 pr-3">Attribute</span>
    </div>
    <div class="column new-term is-10">
      <AutoCompleteField
          id="attribute"
          class="pb-2"
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
    <div class="column is-2 mt-4">
    </div>
    <div class="column is-10 mt-4">
      <span class="has-text-weight-bold">Method = Description + Class {{ methodName }}</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right new-term pb-2 pr-3">Description</span>
    </div>
    <div class="column new-term is-10">
      <AutoCompleteField
          id="methodDescription"
          class="pb-2"
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
      <span class="is-pulled-right required new-term pb-2 pr-3">Class</span>
    </div>
    <div class="column new-term is-10">
      <BasicSelectField
          id="methodClass"
          class="pb-2"
          v-bind:selected-id="trait.method.methodClass"
          v-bind:options="methodOptions"
          v-bind:field-name="'Class'"
          v-bind:show-label="false"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.MethodClass)"
          v-on:input="setMethodClass($event)"
      />
    </div>

    <!--    scale-->
    <div class="column is-2 mt-4">
    </div>
    <div class="column is-10 mt-4">
      <span class="has-text-weight-bold">Scale</span>
    </div>
    <div class="column is-2">
      <span class="is-pulled-right required new-term pb-4 mb-1 pr-3">Class</span>
    </div>
    <div class="column new-term is-10">
      <BasicSelectField
          id="scaleClass"
          v-bind:selected-id="StringFormatters.toStartCase(trait.scale.dataType)"
          v-bind:options="getScaleOptions()"
          v-bind:field-name="'Scale Class'"
          v-bind:show-label="false"
          v-bind:field-help="'Note: additional options for this field will appear after selection'"
          v-bind:server-validations="validationHandler.getValidation(0, TraitError.ScaleType)"
          v-on:input="setScaleClass($event)"
      />
    </div>

      <!-- Formula -->
    <template v-if="trait.method && trait.method.methodClass === MethodClass.Computation">
          <div class="column is-2">
            <span class="is-pulled-right required new-term pb-4 mb-1 pr-3">Formula</span>
          </div>
          <div class="column new-term is-10">
            <BasicInputField
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
        <span class="is-pulled-right new-term pb-2 pr-3">Categories</span>
      </div>
      <div class="column is-10">
        <CategoryTraitForm
            class="p-0"
            v-bind:data="categories"
            v-on:update-data="setCategories($event)"
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
      <div class="column is-10">
        <TextTraitForm class="p-0"/>
      </div>
    </template>

<!--    date options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Date)">
      <div class="column is-2">
      </div>
      <div class="column is-10">
        <DateTraitForm class="p-0"/>
      </div>
    </template>

<!--    numerical options-->
    <template v-if="trait.scale && Scale.dataTypeEquals(trait.scale.dataType, DataType.Numerical)">
      <div class="column is-full">
        <NumericalTraitForm
            class="p-0"
            v-bind:units="trait.scale.units"
            v-bind:decimal-places="trait.scale.decimalPlaces"
            v-bind:valid-min="trait.scale.validValueMin"
            v-bind:valid-max="trait.scale.validValueMax"
            v-on:units-change="trait.scale.units = $event"
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
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import BasicInputField from "@/components/forms/BasicInputField.vue";
import BasicSelectField from "@/components/forms/BasicSelectField.vue";
import {Trait} from "@/breeding-insight/model/Trait";
import {Method, MethodClass} from "@/breeding-insight/model/Method";
import {DataType, Scale} from '@/breeding-insight/model/Scale';
import {ProgramObservationLevel} from '@/breeding-insight/model/ProgramObservationLevel';
import OrdinalTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";
import CategoryTraitForm from "@/components/trait/forms/CategoryTraitForm.vue";
import TextTraitForm from "@/components/trait/forms/TextTraitForm.vue";
import DateTraitForm from "@/components/trait/forms/DateTraitForm.vue";
import DurationTraitForm from "@/components/trait/forms/DurationTraitForm.vue";
import NumericalTraitForm from "@/components/trait/forms/NumericalTraitForm.vue";
import {TraitError} from "@/breeding-insight/model/errors/TraitError";
import {ValidationError} from "@/breeding-insight/model/errors/ValidationError";
import AutoCompleteField from "@/components/forms/AutoCompleteField.vue";
import {StringFormatters} from '@/breeding-insight/utils/StringFormatters';
import {Category} from "@/breeding-insight/model/Category";
import TagField from "@/components/forms/TagField.vue";
import BaseFieldWrapper from "@/components/forms/BaseFieldWrapper.vue";
import {TermType} from "@/breeding-insight/model/TraitSelector";
import {EnumUtils} from "@/breeding-insight/utils/EnumUtils";

@Component({
  components: {
    TagField,
    AutoCompleteField,
    CategoryTraitForm,
    NumericalTraitForm,
    BaseFieldWrapper,
    DurationTraitForm, DateTraitForm, TextTraitForm, OrdinalTraitForm, BasicSelectField, BasicInputField},
  data: () => ({DataType, MethodClass, TraitError, StringFormatters, Scale}),
  filters: {
    toCSV: function (value: string[] | undefined): string {
      let list = '';
      if (value) list = value.join(', ');
      return list;
    }
  }
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

  private termTypes: TermType[] = Object.values(TermType);

  private methodHistory: {[key: string]: Method} = {};
  private scaleHistory: {[key: string]: Scale} = {};
  private lastCategoryType: string = '';

  private categories: Category[] = [];

  get traitName(): string {
    let prefix = '';
    if (this.trait.entity || this.trait.attribute) prefix = '=';
    let entity = this.trait.entity || '';
    let attribute = this.trait.attribute || '';
    return `${prefix} ${entity} ${attribute}`;
  }

  get methodName(): string {
    let prefix = '';
    let description = '';
    let methodClass = '';
    if (this.trait.method && this.trait.method.description) {
      description = this.trait.method.description;
      prefix = '=';
    }
    if (this.trait.method && this.trait.method.methodClass) {
      methodClass = this.trait.method.methodClass;
      prefix = '=';
    }
    return `${prefix} ${description} ${methodClass}`;
  }

  created() {
    if (!this.trait.method) {
      this.trait.method = new Method();
    }
    if (!this.trait.scale){
      this.trait.scale = new Scale();
    }
    if ((this.trait.scale) && (this.trait.scale.categories)) {
      this.categories = this.trait.scale.categories;
    }
    //If termType pulled from backend (rather than the default for new terms), set to display friendly version
    if (this.trait.termType != TermType.PHENOTYPE) {
      this.trait.termType = EnumUtils.enumKeyToValue(this.trait.termType, TermType);
    }
  }

  @Watch('trait', {deep: true})
  emitTrait(val: Trait) {
    this.$emit('trait-change', val);
  }

  toggleActiveState() {
    this.trait.active = !this.trait.active
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

    //Ordinal to Nominal
    if (Scale.dataTypeEquals(value, DataType.Nominal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Ordinal)) {
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Ordinal.toLowerCase()]);
      // Clear the scale category validations if there are any, the switch is confusing
      this.validationHandler.clearValidation(0, 'scale.categories');

      // Clear the values, use labels as the new values if they exist
      if (this.trait.scale.categories) {
        //Remove empty categories
        this.trait.scale.categories = this.trait.scale.categories.filter((value,index) => {
          return (((value.value != null) && (value.value !== "")) || ((value.label != null) && (value.label !== "")));
        });

        //Restore minimum number of categories
        this.restoreMinCategories(1);
      }

      this.trait.scale.dataType = value;
      this.trait!.scale!.units = value;

    } else if (Scale.dataTypeEquals(value, DataType.Ordinal) && Scale.dataTypeEquals(this.lastCategoryType, DataType.Nominal)) {
      //Nominal to Ordinal
      this.trait.scale = Scale.assign(this.scaleHistory[DataType.Nominal.toLowerCase()]);
      // Clear the scale category validations if there are any, the switch is confusing
      this.validationHandler.clearValidation(0, 'scale.categories');

      if (this.trait.scale.categories) {
        //Remove empty categories
        this.trait.scale.categories = this.trait.scale.categories.filter((value,index) => {
          return (((value.value != null) && (value.value !== "")) || ((value.label != null) && (value.label !== "")));
        });

        //Restore minimum number of categories
        this.restoreMinCategories(2);
      }
      this.trait.scale.dataType = value;
      this.trait!.scale!.units = value;

    //Scale history
    } else if (this.scaleHistory[value.toLowerCase()]) {
      this.trait.scale = this.scaleHistory[value.toLowerCase()];
      this.trait.scale.dataType = value;

      if (!Scale.dataTypeEquals(value, DataType.Numerical)) {
        this.trait!.scale!.units = value;
      }
    } else {
      // No history
      this.trait.scale = new Scale();
      this.trait.scale.dataType = value;

      // Allow for units in the numerical and duration traits
      if (Scale.dataTypeEquals(value, DataType.Numerical)) {
        this.trait!.scale!.units = undefined;
      } else {
        this.trait!.scale!.units = value;
      }

      //Establish minimal categories for ordinal and nominal
      if (Scale.dataTypeEquals(value, DataType.Nominal) || Scale.dataTypeEquals(value, DataType.Ordinal)) {
        this.trait.scale.categories = this.prepopulateCategories();
      }
    }
    if ((this.trait.scale) && (this.trait.scale.categories)) {
      this.categories = this.trait.scale.categories;
    }
  }

  prepopulateCategories() {
    let emptyCategories = [];
    if ((this.trait.scale) && (this.trait.scale.dataType)) {
      let minCategories = this.trait.scale.dataType === DataType.Ordinal ? 2 : 1;
      let indexVal = this.trait.scale.dataType === DataType.Ordinal ? true : false;
      for (const i of Array(minCategories).keys()) {
        if (indexVal) {
          emptyCategories.push(new Category(undefined, i + 1 + ''))
        } else {
          emptyCategories.push(new Category(undefined, undefined));
        }
      }
    }
    return emptyCategories;
  }

  restoreMinCategories(minCategories: number) {
    if ((this.trait.scale) && (this.trait.scale.categories)) {
      let belowMinCat = minCategories - this.trait.scale.categories.length;
      if (belowMinCat > 0) {
        for (const i of Array(belowMinCat).keys()) {
          this.trait.scale.categories.push(new Category(undefined, undefined));
        }
      }
    }
  }

  setCategories(categories: Category[]) {
    this.trait.scale!.categories = categories;
    this.categories = categories;
  }

  setObservationLevel(value: string) {
    this.trait!.programObservationLevel = new ProgramObservationLevel(value);
    this.trait!.entity = this.trait!.programObservationLevel.name;
  }

  setOTName(value: string) {
    this.trait.observationVariableName = value;
    this.trait.mainAbbreviation = value;
    this.trait.synonyms = this.trait.synonyms || [];
    if (this.trait.fullName && this.trait.synonyms && this.trait.synonyms.length === 1)
      this.trait.synonyms[1] = this.trait.fullName;
    if (this.trait.fullName && value === '') {
      this.trait.synonyms = [ this.trait.fullName ];
    } else if (!this.trait.fullName && value === '') {
      this.trait.synonyms = [];
    } else {
      this.trait.synonyms[0] = value;
    }
  }

  setTermType(value: TermType) {
    this.trait.termType = value;
  }

  setFullName(value: string) {
    this.trait.fullName = value;
    this.trait.synonyms = this.trait.synonyms || [];
    let index = this.trait.observationVariableName ? 1 : 0;
    this.trait.synonyms[index] = value;
    if (this.trait && this.trait.observationVariableName && value === '') {
      this.trait.synonyms = [ this.trait.observationVariableName ];
    } else if (this.trait && !this.trait.observationVariableName && value === '') {
      this.trait.synonyms = [];
    }
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
