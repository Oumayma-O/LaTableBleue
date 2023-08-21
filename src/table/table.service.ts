import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Table } from './table.model';

@Injectable()
export class TableService {
  constructor(
    //@InjectModel(Table.name) private readonly tableModel: Model<TableDocument>,
  ) {}

  //async findAvailableTablesByPartySize(partySize: number): Promise<Table[]> {
    //return this.tableModel.find({ capacity: { $gte: partySize } }).exec();
  //}
}
