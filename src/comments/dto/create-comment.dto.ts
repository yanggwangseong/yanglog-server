import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
	@IsUUID()
	id: string;

	@IsString()
	comment_content: string;

	@IsUUID()
	parentId: string;

	@IsUUID()
	postId: string;
}
