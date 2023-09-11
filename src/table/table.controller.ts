import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { CreateTableDto } from './dto/createTable.dto';
import { Table } from './models/table.model';
import { UpdateTableDto } from './dto/updateTable.dto';
import { TableService } from './table.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('tables')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Public()
  @Post()
  async createTable(@Body() createTableDto: CreateTableDto): Promise<Table> {
    const newTable = await this.tableService.createTable(createTableDto);
    return newTable;
  }

  /*
  @Post(':restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async addTableByRestaurateur(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
    @Body() createTableDto: CreateTableDto,
  ): Promise<Table> {
    const restaurateurId = req.jwtPayload.sub;
    return this.tableService.addTableByRestaurateur(
      restaurateurId,
      restaurantId,
      createTableDto,
    );
  }
*/

  @Post('many/:restaurantId')
  @Roles(UserRole.RESTAURATEUR)
  async addTablesByRestaurateur(
    @Req() req,
    @Param('restaurantId') restaurantId: string,
    @Body() createTableDtos: CreateTableDto[],
  ): Promise<string> {
    const restaurateurId = req.jwtPayload.sub;
    const result = await this.tableService.addTablesByRestaurateur(
      restaurateurId,
      restaurantId,
      createTableDtos,
    );
    return result;
  }

  @Patch(':tableId')
  @Roles(UserRole.RESTAURATEUR)
  async updateTableByRestaurateur(
    @Req() req,
    @Param('tableId') tableId: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    const restaurateurId = req.jwtPayload.sub;
    return this.tableService.updateTableByRestaurateur(
      restaurateurId,
      tableId,
      updateTableDto,
    );
  }

  @Delete(':tableId')
  @Roles(UserRole.RESTAURATEUR)
  async deleteTableByRestaurateur(
    @Req() req,
    @Param('tableId') tableId: string,
  ): Promise<Table> {
    const restaurateurId = req.jwtPayload.sub;
    return this.tableService.deleteTableByRestaurateur(restaurateurId, tableId);
  }

  @Public()
  @Get('availability/:restaurantId')
  async checkAvailability(
    @Param('restaurantId') restaurantId: string,
    @Query('partySize') partySize: number,
    @Query('dateTime') dateTime: Date,
  ): Promise<Table[]> {
    const availableTables = await this.tableService.checkAvailability(
      restaurantId,
      partySize,
      new Date(dateTime),
    );
    return availableTables;
  }
}
