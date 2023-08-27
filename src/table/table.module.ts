import { Global, Module } from '@nestjs/common';
import { TableService } from './table.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Table, TableSchema } from './models/table.model';
import { EventEmitter2 } from 'eventemitter2';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Table.name, schema: TableSchema }]),
  ],
  providers: [
    TableService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },
  ],
  exports: [TableService],
})
export class TableModule {}
