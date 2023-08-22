import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { Table, TableSchema } from './table.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }])],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
