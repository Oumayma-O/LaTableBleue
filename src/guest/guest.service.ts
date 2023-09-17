import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { User } from '../users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Guest } from './models/guest.model';
import { Model } from 'mongoose';
import { UserService } from '../users/user.service';
import { UpdateGuestBioDto } from './dto/updateGuestBio.dto';
import { CreatePaymentMethodDetailsDto } from './dto/createPaymentMethodDetails.dto';
import * as bcrypt from 'bcrypt';
import {
  PaymentMethodDetails,
  PaymentMethodType,
} from './models/PaymentMethodDetails.model';
import { UpdatePaymentMethodDetailsDto } from './dto/updatePaymentMethodDetailsDto';
import { ObjectId } from 'mongodb';
import { Review } from '../review/models/review.model';
import { EventEmitter2 } from 'eventemitter2';
import { GuestDeletedEvent } from './guest.events';
import { Restaurant } from '../restaurant/models/restaurant.model';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class GuestService {
  constructor(
    @InjectModel(Guest.name) public guestModel: Model<Guest>,
    private eventEmitter: EventEmitter2,
    private restaurantService: RestaurantService,
  ) {}

  async createGuest(createGuestDto: CreateUserDto): Promise<User> {
    return UserService.createUser(this.guestModel, createGuestDto);
  }

  async updateGuest(
    userId: string,
    updateGuestDto: UpdateGuestBioDto,
  ): Promise<User> {
    return UserService.updateUser(this.guestModel, userId, updateGuestDto);
  }

  async deleteGuestWithAssociatedData(userId: string): Promise<Guest> {
    // Delete the user
    const deletedGuest = await this.guestModel.findByIdAndDelete(userId).exec();
    // Emit the GuestDeletedEvent
    this.eventEmitter.emit('guestDeleted', new GuestDeletedEvent(deletedGuest));
    return deletedGuest;
  }

  async addPaymentMethod(
    userId: string,
    createDto: CreatePaymentMethodDetailsDto,
  ): Promise<Guest> {
    console.log(`userId : ${userId}`);
    const user = await this.guestModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingPaymentMethod = user.paymentMethods.find(
      (method) => method.type === createDto.type,
    );
    if (existingPaymentMethod) {
      throw new ConflictException('Payment method already exists');
    }

    const hashedCardNumber = await bcrypt.hash(createDto.cardNumber, 10);
    const hashedExpiryDate = await bcrypt.hash(createDto.expiryDate, 10);
    const hashedCvv = await bcrypt.hash(createDto.cvv, 10);

    const paymentMethod = new PaymentMethodDetails({
      type: createDto.type,
      cardNumber: hashedCardNumber,
      nameOnCard: createDto.nameOnCard,
      expiryDate: hashedExpiryDate,
      cvv: hashedCvv,
    });

    user.paymentMethods.push(paymentMethod);
    await user.save();

    return user;
  }

  async updatePaymentMethod(
    userId: string,
    updateDto: UpdatePaymentMethodDetailsDto,
    type: PaymentMethodType,
  ): Promise<Guest> {
    const user = await this.guestModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentMethod = user.paymentMethods.find(
      (method) => method.type === type,
    );
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    paymentMethod.cardNumber = await bcrypt.hash(updateDto.cardNumber, 10);
    paymentMethod.nameOnCard = updateDto.nameOnCard;
    paymentMethod.expiryDate = await bcrypt.hash(updateDto.expiryDate, 10);
    paymentMethod.cvv = await bcrypt.hash(updateDto.cvv, 10);

    await user.save();
    return user;
  }

  async deletePaymentMethod(
    userId: string,
    type: PaymentMethodType,
  ): Promise<Guest> {
    const user = await this.guestModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentMethodIndex = user.paymentMethods.findIndex(
      (method) => method.type === type,
    );
    if (paymentMethodIndex === -1) {
      throw new NotFoundException('Payment method not found');
    }

    user.paymentMethods.splice(paymentMethodIndex, 1);
    await user.save();

    return user;
  }

  async findAllGuests(): Promise<User[]> {
    return this.guestModel.find({ deletedAt: null }).exec();
  }

  async addReviewToGuest(guestId: ObjectId, reviewId: ObjectId): Promise<void> {
    const guest = await this.guestModel.findById(guestId).exec();
    if (!guest) {
      throw new NotFoundException(`Guest with id ${guestId} not found`);
    }

    guest.reviews.push(reviewId);
    await guest.save();
  }

  async removeReviewFromGuest(
    guestId: ObjectId,
    reviewId: string,
  ): Promise<void> {
    const guest = await this.guestModel.findById(guestId).exec();
    if (!guest) {
      // Handle guest not found
      return;
    }
    // Remove the review ID from the guest's reviews array
    guest.reviews = guest.reviews.filter((id) => id.toString() !== reviewId);
    // Save the updated guest document
    await guest.save();
  }

  async getReviewsForGuest(guestId: string): Promise<Review[]> {
    const guest = await this.guestModel
      .findById(guestId)
      .populate({
        path: 'reviews',
        model: 'Review',
      })
      .exec();
    if (!guest) {
      throw new NotFoundException(`Guest with id ${guestId} not found`);
    }
    const reviews: Review[] = guest.reviews as unknown as Review[];
    return reviews;
  }
  async addRestoToSavedRestoList(
    guestId: string,
    restaurantId: ObjectId,
  ): Promise<Guest> {
    const guest = await this.guestModel.findById(guestId);
    if (!guest) {
      throw new NotFoundException(`Guest with id ${guestId} not found`);
    }
    const resto = await this.restaurantService.getApprovedRestaurant(
      restaurantId.toString(),
    );
    // Check if the restaurant is already in the saved list
    if (!guest.savedRestaurants.includes(resto._id)) {
      guest.savedRestaurants.push(resto._id);
      await guest.save();
    }

    return guest;
  }

  async removeRestoFromSavedRestoList(
    guestId: string,
    restaurantId: ObjectId,
  ): Promise<Guest> {
    const guest = await this.guestModel.findById(guestId);
    if (!guest) {
      throw new NotFoundException(`Guest with id ${guestId} not found`);
    }

    // Check if the restaurant is in the saved list
    const restoIndex = guest.savedRestaurants.indexOf(restaurantId);
    if (restoIndex !== -1) {
      guest.savedRestaurants.splice(restoIndex, 1);
      await guest.save();
    }

    return guest;
  }

  async getGuestById(guestId: string): Promise<Guest> {
    const guest = await this.guestModel.findById(guestId).exec();
    if (!guest) {
      throw new NotFoundException(`Guest with id ${guestId} not found`);
    }
    return guest;
  }

  async addBookingToGuest(guest: Guest, booking: ObjectId) {
    guest.bookings.push(booking);
    await guest.save();
  }

  async getGuestSavedRestaurants(guestId: string): Promise<Restaurant[]> {
    const guest = await this.guestModel.findById(guestId).exec();

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    const savedRestaurantIds = guest.savedRestaurants;

    // Fetch the actual Restaurant documents using the savedRestaurantIds
    const savedRestaurants =
      await this.restaurantService.getSavedRestaurantsByIds(savedRestaurantIds);

    return savedRestaurants;
  }
}
