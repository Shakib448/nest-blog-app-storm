import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePost {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  userId: Number;
}

export class UpdatePost {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
