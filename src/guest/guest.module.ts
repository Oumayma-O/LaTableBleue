import { Global, Module } from '@nestjs/common';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Guest, GuestSchema } from './models/guest.model';
import { GuestDeletedEvent } from './guest.events';

@Global()
@Module({
  controllers: [GuestController],
  providers: [
    GuestService,
    GuestDeletedEvent, // Provide the event class
  ],
  imports: [
    MongooseModule.forFeature([{ name: Guest.name, schema: GuestSchema }]),
  ],
  exports: [GuestService],
})
export class GuestModule {}
