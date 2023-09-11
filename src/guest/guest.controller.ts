import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { GuestService } from './guest.service';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/models/user.model';
import { UpdateGuestBioDto } from './dto/updateGuestBio.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/UserRole.enum';
import { CreatePaymentMethodDetailsDto } from './dto/createPaymentMethodDetails.dto';
import { UpdatePaymentMethodDetailsDto } from './dto/updatePaymentMethodDetailsDto';
import { PaymentMethodType } from './models/PaymentMethodDetails.model';
import { Review } from '../review/models/review.model';
import { ObjectId } from 'mongodb';
import { ParseObjectIdPipe } from '../Pipes/parse-object-id.pipe';

@Controller('guest')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Public()
  @Post()
  createGuest(@Body() createGuestDto: CreateUserDto) {
    return this.guestService.createGuest(createGuestDto);
  }

  @Put('update')
  @Roles(UserRole.GUEST)
  async updateGuest(
    @Req() req,
    @Body() updateGuestBioDto: UpdateGuestBioDto,
  ): Promise<User> {
    return this.guestService.updateGuest(req.jwtPayload.sub, updateGuestBioDto);
  }

  @Public()
  @Get()
  async findAllGuests(): Promise<User[]> {
    return this.guestService.findAllGuests();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Apply authorization guard to ensure only admins can access
  async deleteGuestWithAssociatedData(@Param('id') userId: string) {
    await this.guestService.deleteGuestWithAssociatedData(userId);
    return { message: 'Guest deleted with associated data' };
  }

  @Post('payment-methods')
  @Roles(UserRole.GUEST)
  async addPaymentMethod(
    @Req() req: any,
    @Body() createDto: CreatePaymentMethodDetailsDto,
  ) {
    const userId = req.jwtPayload.sub;
    return this.guestService.addPaymentMethod(userId, createDto);
  }

  @Patch('Credit_Card')
  @Roles(UserRole.GUEST)
  async updateCreditCard(
    @Req() req: any,
    @Body() updateDto: UpdatePaymentMethodDetailsDto,
  ) {
    const userId = req.jwtPayload.sub;
    return this.guestService.updatePaymentMethod(
      userId,
      updateDto,
      PaymentMethodType.CREDIT_CARD,
    );
  }

  @Patch('postCard')
  @Roles(UserRole.GUEST)
  async updatePostCard(
    @Req() req: any,
    @Body() updateDto: UpdatePaymentMethodDetailsDto,
  ) {
    const userId = req.jwtPayload.sub;
    return this.guestService.updatePaymentMethod(
      userId,
      updateDto,
      PaymentMethodType.POSTCARD,
    );
  }

  @Delete('payment-methods/:type')
  @Roles(UserRole.GUEST)
  async deletePaymentMethod(
    @Req() req: any,
    @Param('type', ValidationPipe) type: PaymentMethodType,
  ) {
    const userId = req.jwtPayload.sub;
    return this.guestService.deletePaymentMethod(userId, type);
  }

  @Get('reviews')
  @Roles(UserRole.GUEST) // Only admin and guest roles are permitted
  async getReviewsForGuest(@Req() req): Promise<Review[]> {
    return this.guestService.getReviewsForGuest(req.jwtPayload.sub);
  }

  @Post('saved-restaurants/:restaurantId')
  @Roles(UserRole.GUEST)
  async addRestoToSavedRestoList(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
  ) {
    return this.guestService.addRestoToSavedRestoList(
      req.jwtPayload.sub,
      restaurantId,
    );
  }

  @Delete('saved-restaurants/:restaurantId')
  @Roles(UserRole.GUEST)
  async removeRestoFromSavedRestoList(
    @Req() req,
    @Param('restaurantId', ParseObjectIdPipe) restaurantId: ObjectId,
  ) {
    return this.guestService.removeRestoFromSavedRestoList(
      req.jwtPayload.sub,
      restaurantId,
    );
  }

  @Get('saved-restaurants')
  @Roles(UserRole.GUEST)
  async getGuestSavedRestaurants(@Req() req) {
    const savedRestaurants = await this.guestService.getGuestSavedRestaurants(
      req.jwtPayload.sub,
    );

    return {
      message: 'Guest saved restaurants retrieved successfully',
      data: savedRestaurants,
    };
  }
}
