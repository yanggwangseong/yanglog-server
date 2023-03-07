import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
	@IsString()
	comment_content: string;

	parentId?: string;

	replyId?: string;

	@IsUUID()
	postId: string;
}
