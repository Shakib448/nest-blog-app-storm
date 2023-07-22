import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateComment {
  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsInt()
  postId: Number;

  @IsNotEmpty()
  @IsInt()
  userId: Number;
}
