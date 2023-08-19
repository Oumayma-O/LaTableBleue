import { Injectable } from '@nestjs/common';
import { CreateClientDashboardDto } from './dto/create-client-dashboard.dto';
import { UpdateClientDashboardDto } from './dto/update-client-dashboard.dto';

@Injectable()
export class ClientDashboardService {
  create(createClientDashboardDto: CreateClientDashboardDto) {
    return 'This action adds a new clientDashboard';
  }

  findAll() {
    return `This action returns all clientDashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientDashboard`;
  }

  update(id: number, updateClientDashboardDto: UpdateClientDashboardDto) {
    return `This action updates a #${id} clientDashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientDashboard`;
  }
}
