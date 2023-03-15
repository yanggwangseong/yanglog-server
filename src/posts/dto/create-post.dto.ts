import { IsString, IsUUID } from 'class-validator';

export class CreatePostDto {
	@IsUUID()
	categoryId!: string;

	@IsString()
	title!: string;

	@IsString()
	subtitle!: string;

	@IsString()
	description!: string;
}
