import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';

@Entity({ name: 'user_like_post' })
export class UserLikePostEntity {
	@PrimaryColumn('uuid')
	public readonly userId!: string;

	@PrimaryColumn('uuid')
	public readonly postId!: string;

	@ManyToOne((type) => UserEntity, (user) => user.userLikesPosts)
	@JoinColumn({ name: 'userId', referencedColumnName: 'id' })
	user!: UserEntity;

	@ManyToOne((type) => PostEntity, (user) => user.postLikedByUsers)
	@JoinColumn({ name: 'postId', referencedColumnName: 'id' })
	post!: PostEntity;

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
