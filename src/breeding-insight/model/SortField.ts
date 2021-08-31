export class SortField {
  sortField: string;
  sortOrder: string;

  constructor(sortField: string, sortOrder: string) {
    this.sortField = sortField;
    this.sortOrder = sortOrder;
  }
}