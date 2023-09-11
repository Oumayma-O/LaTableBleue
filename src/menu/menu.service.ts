import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongoose';
import { CreateMenuDto } from './dto/createMenu.dto';
import { Menu } from './models/menu.model';
import { RestaurantService } from '../restaurant/restaurant.service';
import {
  UpdateDishDto,
  UpdateMenuDto,
  UpdateMenuItemDto,
} from './dto/update.MenuItem.dto';
import { EventEmitter2 } from 'eventemitter2';
import { Restaurant } from '../restaurant/models/restaurant.model';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    private eventEmitter: EventEmitter2, // Inject the EventEmitter2

    private readonly restaurantService: RestaurantService,
  ) {}

  @OnEvent('restaurantDeleted')
  async handleRestaurantDeleted(deletedRestaurant: Restaurant) {
    const restaurantId = deletedRestaurant._id;

    // Delete bookings associated with the deleted restaurant
    await this.deleteAllMenusWithRestoId(restaurantId);
  }

  async getMenuById(menuId: ObjectId): Promise<Menu> {
    const menu = await this.menuModel.findById(menuId).exec();

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    return menu;
  }

  async getAllRestoMenus(restaurantId: ObjectId): Promise<Menu[]> {
    return this.menuModel.find({ restaurantId }).exec();
  }

  async deleteAllMenusWithRestoId(restaurantId: ObjectId): Promise<void> {
    await this.menuModel.deleteMany({ restaurantId }).exec();
  }

  async createMenu(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    createMenuDto: CreateMenuDto,
  ): Promise<Menu> {
    const restaurantMenu = await this.menuModel
      .findOne({ name: createMenuDto.name, restaurantId })
      .exec();

    if (restaurantMenu) {
      throw new ConflictException('Menu name already exists in the restaurant');
    }

    await this.verifyRestaurateurIsManager(restaurateurId, restaurantId);

    const menu = new this.menuModel({ ...createMenuDto, restaurantId });
    // Update the restaurant's menus array
    await this.restaurantService.addMenuToResto(menu._id, restaurantId);
    return menu.save();
  }

  async deleteMenu(restaurateurId: ObjectId, menuId: ObjectId): Promise<void> {
    const menu = await this.getMenuById(menuId);
    if (menu!) {
      throw new NotFoundException(`Menu ith ${menuId} doesn't exist`);
    }
    await this.verifyRestaurateurIsManager(restaurateurId, menu.restaurant);

    const result = await this.menuModel.deleteOne({ _id: menuId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Menu not found');
    }
    await this.restaurantService.removeMenuFromResto(menu.restaurant, menuId);
  }

  async updateMenuName(
    restaurateurId: ObjectId,
    menuId: ObjectId,
    updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    const menu = await this.getMenuById(menuId);
    if (menu!) {
      throw new NotFoundException(`Menu ith ${menuId} doesn't exist`);
    }
    await this.verifyRestaurateurIsManager(restaurateurId, menu.restaurant);

    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(menuId, { name: updateMenuDto.name }, { new: true })
      .exec();

    return updatedMenu;
  }

  async updateCategoryName(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    menuId: ObjectId,
    categoryId: ObjectId,
    updateCategoryDto: UpdateMenuItemDto,
  ): Promise<Menu> {
    await this.verifyRestaurateurIsManager(restaurateurId, restaurantId);

    const updatedMenu = await this.menuModel.findById(menuId).exec();

    if (!updatedMenu) {
      throw new NotFoundException('Menu not found');
    }

    const categoryIndex = updatedMenu.menuItems.findIndex((item) =>
      item._id.equals(categoryId),
    );

    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    updatedMenu.menuItems[categoryIndex].category = updateCategoryDto.category;
    await updatedMenu.save();

    return updatedMenu;
  }

  async updateDish(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    menuId: ObjectId,
    categoryId: ObjectId,
    dishId: ObjectId,
    updateDishDto: UpdateDishDto,
  ): Promise<Menu> {
    await this.verifyRestaurateurIsManager(restaurateurId, restaurantId);

    const updatedMenu = await this.menuModel.findById(menuId).exec();

    if (!updatedMenu) {
      throw new NotFoundException('Menu not found');
    }

    const categoryIndex = updatedMenu.menuItems.findIndex((item) =>
      item._id.equals(categoryId),
    );

    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    const dishIndex = updatedMenu.menuItems[categoryIndex].items.findIndex(
      (item) => item._id.equals(dishId),
    );

    if (dishIndex === -1) {
      throw new NotFoundException('Dish not found');
    }

    const dishToUpdate = updatedMenu.menuItems[categoryIndex].items[dishIndex];
    dishToUpdate.name = updateDishDto.name;
    dishToUpdate.price = updateDishDto.price;
    dishToUpdate.description = updateDishDto.description;

    await updatedMenu.save();

    return updatedMenu;
  }

  async deleteMenuItem(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    menuId: ObjectId,
    categoryId: ObjectId,
  ): Promise<Menu> {
    await this.verifyRestaurateurIsManager(restaurateurId, restaurantId);

    const updatedMenu = await this.menuModel.findById(menuId).exec();

    if (!updatedMenu) {
      throw new NotFoundException('Menu not found');
    }

    const categoryIndex = updatedMenu.menuItems.findIndex((item) =>
      item._id.equals(categoryId),
    );

    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    updatedMenu.menuItems.splice(categoryIndex, 1);
    await updatedMenu.save();

    return updatedMenu;
  }

  async deleteDish(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
    menuId: ObjectId,
    categoryId: ObjectId,
    dishId: ObjectId,
  ): Promise<Menu> {
    await this.verifyRestaurateurIsManager(restaurateurId, restaurantId);

    const updatedMenu = await this.menuModel.findById(menuId).exec();

    if (!updatedMenu) {
      throw new NotFoundException('Menu not found');
    }

    const categoryIndex = updatedMenu.menuItems.findIndex((item) =>
      item._id.equals(categoryId),
    );

    if (categoryIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    const dishIndex = updatedMenu.menuItems[categoryIndex].items.findIndex(
      (item) => item._id.equals(dishId),
    );

    if (dishIndex === -1) {
      throw new NotFoundException('Dish not found');
    }

    updatedMenu.menuItems[categoryIndex].items.splice(dishIndex, 1);
    await updatedMenu.save();

    return updatedMenu;
  }

  private async verifyRestaurateurIsManager(
    restaurateurId: ObjectId,
    restaurantId: ObjectId,
  ): Promise<void> {
    const restaurant = await this.restaurantService.getApprovedRestaurant(
      restaurantId.toString(),
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.manager.toString() !== restaurateurId.toString()) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
  }
}
