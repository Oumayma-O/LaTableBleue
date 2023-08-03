import { Module } from '@nestjs/common';
import { CautionController } from './caution.controller';
import { CautionService } from './caution.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Caution, CautionSchema } from './caution.model';

@Module({
  controllers: [CautionController],
  providers: [CautionService],

  imports: [
    MongooseModule.forFeature([{ name: Caution.name, schema: CautionSchema }]),
  ],
})
export class CautionModule {}
