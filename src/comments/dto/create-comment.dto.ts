import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	comment_content: string;

	parentId: string;

	@IsUUID()
	postId: string;
}
