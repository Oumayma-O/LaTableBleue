import { IsUrl } from 'class-validator';

export class SocialLinksDto {
  @IsUrl()
  FbLink?: string;

  @IsUrl()
  InstaLink?: string;

  @IsUrl()
  TwitterLink?: string;
}
