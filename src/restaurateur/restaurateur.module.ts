import { Global, Module } from '@nestjs/common';
import { RestaurateurService } from './restaurateur.service';
import { RestaurateurController } from './restaurateur.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurateur, RestaurateurSchema } from './models/restaurateur.model';

@Global()
@Module({
  controllers: [RestaurateurController],
  providers: [RestaurateurService],
  imports: [
    MongooseModule.forFeature([
      { name: Restaurateur.name, schema: RestaurateurSchema },
    ]),
  ],
  exports: [RestaurateurService],
})
export class RestaurateurModule {}
