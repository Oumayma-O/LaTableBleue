import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports:[
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }])
  ]
})
export class AdminModule {}
