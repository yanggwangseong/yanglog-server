import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserLikeCommentEntity } from 'src/users/entities/user-like-comment.entity';
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

@Entity({ name: 'comment' })
export class CommentEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column('text')
	comment_content!: string;

	@Column('uuid', { nullable: true })
	parentId?: string; //최초 부모격인 댓글 uid

	@ManyToOne(() => CommentEntity, (comment) => comment.children_comments)
	parent?: CommentEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.parent)
	children_comments!: CommentEntity[];

	@Column('uuid', { nullable: true })
	replyId?: string; //실제 답글을 달고자 하는 댓글 uid 해당 uid로 user.name을 알아내서 replyUserName 담음.

	@Column('uuid')
	userId!: string;

	@ManyToOne(() => UserEntity, (user) => user.comments)
	user!: UserEntity;

	@Column('uuid')
	postId!: string;

	@ManyToOne(() => PostEntity, (post) => post.comments)
	post!: PostEntity;

	@Exclude()
	@OneToMany(() => UserLikeCommentEntity, (ula) => ula.comment)
	commentLikedByUsers!: UserLikeCommentEntity[];

	@CreateDateColumn({
		type: 'timestamp',
		precision: 3,
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt!: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		precision: 3,
		default: () => 'CURRENT_TIMESTAMP',
		// onUpdate: 'CURRENT_TIMESTAMP', mysql에서만 작동
	})
	updatedAt!: Date;

	protected userLike!: number;

	setUserLike(userId: string) {
		const index = this.commentLikedByUsers?.findIndex(
			(v) => v.userId === userId,
		);
		this.userLike = index > -1 ? this.commentLikedByUsers[index].value : 0;
	}

	@Expose() get myLike(): number {
		return this.userLike;
	}

	@Expose() get totalLikes(): number {
		const initalValue = 0;
		return this.commentLikedByUsers?.reduce(
			(previousValue, currentObject) =>
				previousValue + (currentObject.value || 0),
			initalValue,
		);
	}
}
