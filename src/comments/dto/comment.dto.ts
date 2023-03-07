import { IsString } from 'class-validator';

export class CommentDto {
	id: string;

	comment_content: string;

	parentId?: string;

	userId: string;

	parentUserName?: string;

	updatedAt: Date;

	children_comments: CommentDto[];
}
