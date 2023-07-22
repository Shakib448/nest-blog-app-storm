import { IsNotEmpty, IsString } from 'class-validator';

export class CreateComment {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
