import { Global, Module } from '@nestjs/common';
import { TableService } from './table.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './models/table.model';
import { TableController } from './table.controller';
import { TableEventHandlersService } from './table.EventHandler';

@Global()
@Module({
  controllers: [TableController],
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [TableService, TableEventHandlersService],
  exports: [TableService, TableEventHandlersService],
})
export class TableModule {}
