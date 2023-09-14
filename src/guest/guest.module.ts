import { Global, Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from './models/guest.model';
import { GuestDeletedEvent } from './guest.events';
import { GuestEventHandlersService } from './guest.EventHandlers';

@Global()
@Module({
  controllers: [GuestController],
  providers: [
    GuestService,
    GuestDeletedEvent,
    GuestEventHandlersService, // Provide the event class
  ],
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  exports: [GuestService, GuestEventHandlersService],
})
export class GuestModule {}
