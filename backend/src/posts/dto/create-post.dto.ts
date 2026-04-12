import { IsString, IsInt, MinLength, MaxLength, Min, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Body is required' })
  @MinLength(10, { message: 'Body must be at least 10 characters' })
  body!: string;

  @IsInt({ message: 'Author user ID must be an integer' })
  @Min(1)
  authorUserId!: number;
}
