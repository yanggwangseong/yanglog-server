import { UserEntity } from 'src/users/entities/user.entity';

export class CommentDto {
	id: string;

	comment_content: string;

	parentId?: string;

	userId: string;

	writer?: string;

	replyId?: string;

	parentUserName?: string;

	replyUserName?: string;

	updatedAt: Date;

	children_comments?: CommentDto[];
}
