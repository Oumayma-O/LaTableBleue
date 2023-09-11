import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistToken } from './models/blacklistToken.model';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectModel(BlacklistToken.name)
    private readonly blacklistTokenModel: Model<BlacklistToken>,
  ) {}

  async addTokenToBlacklist(
    token: string,
    expireAt: Date,
  ): Promise<BlacklistToken> {
    const newToken = new this.blacklistTokenModel({ token, expireAt });
    return newToken.save();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.blacklistTokenModel
      .findOne({ token })
      .exec();
    return !!blacklistedToken;
  }
}
