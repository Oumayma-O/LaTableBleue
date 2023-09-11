import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './models/menu.model';
import { ObjectId } from 'mongoose';
import { CreateMenuDto } from './dto/createMenu.dto';
import {
  UpdateDishDto,
  UpdateMenuDto,
  UpdateMenuItemDto,
} from './dto/update.MenuItem.dto';
import { ParseObjectIdPipe } from '../Pipes/parse-object-id.pipe';
import { UserRole } from '../users/UserRole.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get(':restaurantId')
  async getAllRestoMenus(
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
  ): Promise<Menu[]> {
    return this.menuService.getAllRestoMenus(restaurantId);
  }

  @Public()
  @Get(':menuId')
  async getMenuById(
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
  ): Promise<Menu> {
    return this.menuService.getMenuById(menuId);
  }

  @Post(':restaurantId')
  @Roles(UserRole.RESTAURATEUR) // Apply RolesGuard to this endpoint, only managers can access
  async createMenu(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<Menu> {
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.createMenu(
      restaurateurId,
      restaurantId,
      createMenuDto,
    );
  }

  @Roles(UserRole.RESTAURATEUR) // Apply RolesGuard to this endpoint, only managers can access
  @Delete(':menuId')
  async deleteMenu(
    @Req() req,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
  ): Promise<void> {
    // Get the authenticated user's ID (from JWT payload)
    const restaurateurId = req.jwtPayload.sub;
    await this.menuService.deleteMenu(restaurateurId, menuId);
  }

  @Roles(UserRole.RESTAURATEUR) // Apply RolesGuard to this endpoint, only managers can access
  @Put(':menuId')
  async updateMenuName(
    @Req() req,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    // Get the authenticated user's ID (from JWT payload)
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.updateMenuName(
      restaurateurId,
      menuId,
      updateMenuDto,
    );
  }

  @Roles(UserRole.RESTAURATEUR)
  @Put(':restaurantId/:menuId/categories/:categoryId')
  async updateCategoryName(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: ObjectId,
    @Body() updateCategoryDto: UpdateMenuItemDto,
  ): Promise<Menu> {
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.updateCategoryName(
      restaurateurId,
      restaurantId,
      menuId,
      categoryId,
      updateCategoryDto,
    );
  }

  @Roles(UserRole.RESTAURATEUR)
  @Put(':restaurantId/:menuId/categories/:categoryId/dishes/:dishId')
  async updateDish(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: ObjectId,
    @Param('dishId', ParseObjectIdPipe) dishId: ObjectId,
    @Body() updateDishDto: UpdateDishDto,
  ): Promise<Menu> {
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.updateDish(
      restaurateurId,
      restaurantId,
      menuId,
      categoryId,
      dishId,
      updateDishDto,
    );
  }

  @Roles(UserRole.RESTAURATEUR)
  @Delete(':restaurantId/:menuId/:categoryId')
  async deleteMenuItem(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: ObjectId,
  ): Promise<Menu> {
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.deleteMenuItem(
      restaurateurId,
      restaurantId,
      menuId,
      categoryId,
    );
  }

  @Roles(UserRole.RESTAURATEUR)
  @Delete(':restaurantId/:menuId/:categoryId/:dishId')
  async deleteDish(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
    @Param('menuId', ParseObjectIdPipe) menuId: ObjectId,
    @Param('categoryId', ParseObjectIdPipe) categoryId: ObjectId,
    @Param('dishId', ParseObjectIdPipe) dishId: ObjectId,
  ): Promise<Menu> {
    const restaurateurId = req.jwtPayload.sub;
    return this.menuService.deleteDish(
      restaurateurId,
      restaurantId,
      menuId,
      categoryId,
      dishId,
    );
  }
}
