import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Entity({ name: 'user_like_comment' })
export class UserLikeCommentEntity {
	@PrimaryColumn('uuid')
	public readonly userId!: string;

	@PrimaryColumn('uuid')
	public readonly commentId!: string;

	@ManyToOne((type) => UserEntity, (user) => user.userLikesPosts)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@ManyToOne((type) => CommentEntity, (user) => user.commentLikedByUsers)
	@JoinColumn({ name: 'postId', referencedColumnName: 'id' })
	comment!: CommentEntity;
}
