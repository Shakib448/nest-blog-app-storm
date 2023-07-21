import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCredentials {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class UpdateProfile {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;
}
