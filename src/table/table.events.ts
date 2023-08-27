import { Table } from './models/table.model';

export class TableDeletedEvent {
  constructor(public readonly deletedTable: Table) {}
}
