/*
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Vue, Prop } from 'vue-property-decorator'
import {Validations} from "vuelidate-property-decorators"
import {TableRow} from "@/breeding-insight/model/view_models/TableRow"
import {DataFormEventBusHandler} from "@/components/forms/DataFormEventBusHandler";

@Component
class ValidationMixin extends Vue {

  @Prop()
  private rowValidations!: Object;
  @Prop()
  dataFormState!: DataFormEventBusHandler;

  private currentValidationRow: TableRow<any> | undefined = undefined;

  // if this row based works then make mixin so can reuse and use Vue class functions

  @Validations()
  validations() {
    if (this.rowValidations) {
      return {
        currentValidationRow: {
          editData: {
            ...this.rowValidations
          }
        }
      }
    }

    return {}
  }

  setValidationRow(record: TableRow<any>) {
    if (this.currentValidationRow && this.currentValidationRow !== record){
      this.cancelEdit(this.currentValidationRow);
    }

    // Set the new edit row
    this.currentValidationRow = record;
  }

  getValidations(){
    return this.$v.currentValidationRow.editData;
  }

  validateAndSubmit(record: TableRow<any>) {
    this.currentValidationRow = record;
    this.$v.currentValidationRow.editData!.$touch();

    if (this.$v.currentValidationRow.editData!.$anyError){
      this.dataFormState.bus.$emit(DataFormEventBusHandler.SAVE_COMPLETE_EVENT);
      this.$emit('show-error-notification', 'Fix Invalid Fields');
      return;
    }
    else {
      // Check all of our fields to see if they were required
      
      const editedRecord = record.editData;
      this.$emit('submit', editedRecord);
      this.$v.currentValidationRow.editData!.$reset();
    }
  }

  cancelEdit(record: TableRow<any>) {
    record.cancelEdit();
    // clear form
    this.$v.currentValidationRow.editData!.$reset();
  }
}
export default ValidationMixin