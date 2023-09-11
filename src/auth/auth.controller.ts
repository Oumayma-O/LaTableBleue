import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UserRole } from '../users/UserRole.enum';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { BlacklistToken } from '../blacklist/models/blacklistToken.model';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Patch('update-password')
  //@Role(UserRole.ADMIN)
  async updatePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = await this.authService.updatePassword(
      req.jwtPayload.sub,
      req.jwtPayload.role,
      updatePasswordDto,
    );
    return updatedUser;
  }

  @Public()
  @Post('login/guest')
  async GuestLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.GUEST);
  }

  @Public()
  @Post('login/restaurateur')
  async RestaurateurLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.RESTAURATEUR);
  }

  @Public()
  @Post('login/admin')
  async AdminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.ADMIN);
  }

  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.jwtPayload.sub, req.jwtPayload.role);
  }

  @Public()
  @Post('signup/guest')
  async signUpGuest(@Body() data: CreateUserDto) {
    return this.authService.signUp(data, UserRole.GUEST);
  }

  @Public()
  @Post('signup/admin')
  async signUpAdmin(@Body() data: CreateUserDto) {
    return this.authService.signUp(data, UserRole.ADMIN);
  }

  @Public()
  @Post('signup/restaurateur')
  async signUpRestaurateur(@Body() data: CreateUserDto) {
    return this.authService.signUp(data, UserRole.RESTAURATEUR);
  }

  @Post('logout')
  async logout(@Req() req): Promise<BlacklistToken> {
    const token = req.headers.authorization.replace('Bearer ', '');
    // Get token expiration time from JWT payload or configuration
    const expiresAt = new Date(/* ... */);
    return await this.authService.logout(token, expiresAt);
  }

  @Post('sign-out/guest')
  @Roles(UserRole.GUEST)
  async signOutGuest(@Req() req) {
    const userId = req.jwtPayload.sub; // Assuming sub contains userId
    await this.authService.signOutGuest(userId);
    return { message: 'Guest successfully signed out' };
  }

  @Post('sign-out/restaurateur')
  @Roles(UserRole.RESTAURATEUR)
  async signOutRestaurateur(@Req() req) {
    const userId = req.jwtPayload.sub; // Assuming sub contains userId
    await this.authService.signOutRestaurateur(userId);
    return { message: 'Restaurateur successfully signed out' };
  }

  @Post('sign-out/admin')
  @Roles(UserRole.ADMIN)
  async signOutAdmin(@Req() req) {
    const userId = req.jwtPayload.sub; // Assuming sub contains userId
    await this.authService.signOutAdmin(userId);
    return { message: 'Admin successfully signed out' };
  }
}
