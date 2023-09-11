import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { RestaurateurService } from './restaurateur.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { User } from '../users/models/user.model';
import { UpdateUserDto } from '../users/dto/updateUser.dto';

@Controller('restaurateur')
export class RestaurateurController {
  constructor(private readonly restaurateurService: RestaurateurService) {}

  @Public()
  @Post()
  createRestaurateur(@Body() createUserDto: CreateUserDto) {
    return this.restaurateurService.createRestaurateur(createUserDto);
  }

  @Put('update')
  @Roles(UserRole.RESTAURATEUR)
  async updateRestaurateur(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.restaurateurService.updateRestaurateur(
      req.jwtPayload.sub,
      updateUserDto,
    );
  }

  @Public()
  @Get()
  async findAllRestaurateurs(): Promise<User[]> {
    return this.restaurateurService.findAllRestaurateurs();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Apply authorization guard to ensure only admins can access
  async deleteRestaurateurWithRestaurant(@Param('id') restaurateurId: string) {
    await this.restaurateurService.deleteRestaurateurWithRestaurant(
      restaurateurId,
    );
    return { message: 'Restaurateur deleted with associated restaurant data' };
  }
}
