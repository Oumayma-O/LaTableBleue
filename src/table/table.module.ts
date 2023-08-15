import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './table.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [TableService],
})
export class TableModule {}
