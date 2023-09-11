import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { BlacklistModule } from '../blacklist/blacklist.module';
import { JwtPayloadGuard } from './guards/jwtPayload.guard';
import { jwtConfig } from './jwt.config';

@Global()
@Module({
  imports: [JwtModule.registerAsync(jwtConfig), UserModule, BlacklistModule],
  controllers: [AuthController],
  providers: [AuthService, JwtPayloadGuard],
})
export class AuthModule {}
