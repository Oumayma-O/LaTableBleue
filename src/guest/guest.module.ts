import { Global, Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from './models/guest.model';
import { GuestDeletedEvent } from './guest.events';
import { EventEmitter2 } from 'eventemitter2';

@Global()
@Module({
  controllers: [GuestController],
  providers: [
    GuestService,
    {
      provide: 'EventEmitter2', // Provide the EventEmitter2 token
      useValue: new EventEmitter2(), // Create a new instance of EventEmitter2
    },
    GuestDeletedEvent, // Provide the event class
  ],
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  exports: [GuestService],
})
export class GuestModule {}
