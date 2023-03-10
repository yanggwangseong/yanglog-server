import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
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
	@JoinColumn({ name: 'commentId', referencedColumnName: 'id' })
	comment!: CommentEntity;

	@CreateDateColumn({
		type: 'timestamp',
		precision: 3,
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		precision: 3,
		default: () => 'CURRENT_TIMESTAMP',
		// onUpdate: 'CURRENT_TIMESTAMP', mysql에서만 작동
	})
	updatedAt: Date;
}
