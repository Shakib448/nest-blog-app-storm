import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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
