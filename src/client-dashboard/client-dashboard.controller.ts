import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientDashboardService } from './client-dashboard.service';
import { CreateClientDashboardDto } from './dto/create-client-dashboard.dto';
import { UpdateClientDashboardDto } from './dto/update-client-dashboard.dto';

@Controller('client-dashboard')
export class ClientDashboardController {
  constructor(private readonly clientDashboardService: ClientDashboardService) {}

  @Post()
  create(@Body() createClientDashboardDto: CreateClientDashboardDto) {
    return this.clientDashboardService.create(createClientDashboardDto);
  }

  @Get()
  findAll() {
    return this.clientDashboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDashboardDto: UpdateClientDashboardDto) {
    return this.clientDashboardService.update(+id, updateClientDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientDashboardService.remove(+id);
  }
}
