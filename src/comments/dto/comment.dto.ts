export class CommentDto {
	id: string;

	comment_content: string;

	parentId?: string;

	userId: string;

	writer: string;

	replyId?: string;

	likes: number;

	mylike?: number;

	replyUserName?: string;

	updatedAt: Date;

	children_comments?: CommentDto[];
}
