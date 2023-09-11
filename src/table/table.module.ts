import { Global, Module } from '@nestjs/common';
import { TableService } from './table.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './models/table.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
