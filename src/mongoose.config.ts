import { MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

export async function mongooseConfigFactory(
  configService: ConfigService,
): Promise<MongooseModuleOptions> {
  return {
    uri: `mongodb://${configService.get('DB_HOST')}:${configService.get(
      'DB_PORT',
    )}/${configService.get('DB_NAME')}`,
  };
}
