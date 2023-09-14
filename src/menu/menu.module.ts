import { Global, Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './models/menu.model';
import { MenuEventHandlersService } from './menu.EventHandlers';

@Global()
@Module({
  controllers: [MenuController],
  providers: [MenuService, MenuEventHandlersService],
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  exports: [MenuService, MenuEventHandlersService],
})
export class MenuModule {}
