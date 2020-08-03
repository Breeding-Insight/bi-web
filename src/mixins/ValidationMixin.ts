import { Component, Vue } from 'vue-property-decorator'
import {Validations} from "vuelidate-property-decorators"
import {TableRow} from "@/breeding-insight/model/view_models/TableRow"

@Component
class ValidationMixin extends Vue {

  private currentValidationRow!: TableRow<any>;

    // if this row based works then make mixin so can reuse and use Vue class functions

    @Validations()
    validations() {
      if (this.rowValidations && this.currentValidationRow ) {
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
  
    getValidations(record: TableRow<any>, index: number) {
      console.log('GET VALIDATIONS');
      this.currentValidationRow = record;
      console.log(this.currentValidationRow);
      console.log(this.$v);
      return this.$v.currentValidationRow;
    }

    validateAndSubmit(record: TableRow<any>, rowIndex: number) {

      this.$v.currentValidationRow.editData.$touch();
      if (this.$v.currentValidationRow.editData.$anyError){
        this.$emit('show-error-notification', 'Fix Invalid Fields');
        return;
      }
      else {
        // Check all of our fields to see if they were required
        this.$v.currentValidationRow.editData.$reset();
        const editedRecord = record.editData;
        this.$emit('submit', editedRecord);
      }
    }

    cancelEdit(record: TableRow<any>, rowIndex: number) {
      record.toggleEdit();
      record.revertChanges();
      // clear form
      this.$v.currentValidationRow.editData.$reset();
    }
}
export default ValidationMixin