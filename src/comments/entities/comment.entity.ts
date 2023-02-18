import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('Comment')
export class CommentEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column('text')
	comment_content: string;

	@Column('uuid', { nullable: true })
	parentId: string;

	@ManyToOne(() => CommentEntity, (comment) => comment.children_comment)
	parent: CommentEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.parentId)
	children_comment: CommentEntity[];

	@Column('uuid')
	userId: string;

	@ManyToOne(() => UserEntity, (user) => user.comments, { eager: false })
	user: UserEntity;

	@Column('uuid')
	postId: string;

	@ManyToOne(() => PostEntity, (post) => post.comments, { eager: false })
	post: PostEntity;

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
