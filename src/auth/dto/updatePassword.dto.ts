import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
