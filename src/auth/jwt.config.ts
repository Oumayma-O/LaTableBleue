import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { jwtConstants } from './constants';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    };
  },
};
