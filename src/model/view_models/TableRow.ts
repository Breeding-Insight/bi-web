export class TableRow<T extends Object> {
  data!: T;
  edit: boolean;
  new: boolean;
  editable: boolean;
  nameError: boolean;
  emailError: boolean;
  editData!: T;

  constructor(editable: boolean, data: T) {
    //this.data = new User(id, name, email, roles);
    //this.editData = Object.assign({}, this.data);
    this.editable = editable;
    this.new = false;
    this.edit = false;
    this.new = false;
    this.nameError = false;
    this.emailError = false;
    this.data = data;
    if (editable) {
        this.editData = {...data};
    }
      
  }

  confirmChanges() {
    this.data = {...this.editData};
  }

  revertChanges() {
    this.editData = {...this.data};
  }

  toggleEdit() {
    if (this.editable) {
      this.edit = !this.edit;
    }
  }

  toggleNew() {
    this.new = !this.new;
  }

  cancelEdit() {
    this.toggleEdit();
    this.revertChanges();
  }
}