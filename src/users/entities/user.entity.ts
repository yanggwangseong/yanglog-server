import { CommentEntity } from 'src/comments/entities/comment.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { UserLikePostEntity } from './user-like-post.entity';
import { UserLikeCommentEntity } from './user-like-comment.entity';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
	GUEST = 'guest',
}

@Entity({ name: 'user' })
@Unique(['email'])
export class UserEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column('varchar', { length: 30 })
	name: string;

	@Column('varchar', { length: 60 })
	email: string;

	@Column('varchar', { length: 60 })
	password: string;

	@Column('varchar', { length: 60 })
	signupVerifyToken: string;

	@Column('varchar', { length: 60, nullable: true })
	refreshToken: string | null;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

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

	@OneToMany(() => UserLikePostEntity, (ula) => ula.user)
	userLikesPosts?: UserLikePostEntity[];

	@OneToMany(() => UserLikeCommentEntity, (ula) => ula.user)
	userLikesComments?: UserLikeCommentEntity[];

	@OneToMany((type) => PostEntity, (post) => post.user, { eager: false })
	posts: PostEntity[];

	@OneToMany(() => CommentEntity, (comment) => comment.userId)
	comments: CommentEntity[];
}
