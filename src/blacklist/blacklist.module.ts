import { Global, Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlacklistToken,
  BlacklistTokenSchema,
} from './models/blacklistToken.model';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlacklistToken.name, schema: BlacklistTokenSchema },
    ]),
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
