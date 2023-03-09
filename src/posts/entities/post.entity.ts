import { CommentEntity } from 'src/comments/entities/comment.entity';
import { CategoryEntity } from 'src/manage/categories/entities/category.entity';
import { UserLikePostEntity } from 'src/users/entities/user-like-post.entity';
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

@Entity({ name: 'post' })
export class PostEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column('varchar', { length: 120 })
	title: string;

	@Column('varchar', { length: 120 })
	subtitle: string;

	@Column('text')
	description: string;

	@Column('varchar', { length: 120, nullable: true })
	imageUrn: string | null;

	@Column('uuid')
	userId: string;

	@ManyToOne((type) => UserEntity, (user) => user.posts, { eager: false })
	user: UserEntity;

	@Column('uuid')
	categoryId: string;

	@ManyToOne((type) => CategoryEntity, (category) => category.posts, {
		eager: false,
	})
	category: CategoryEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.postId)
	comments: CommentEntity[];

	@OneToMany(() => UserLikePostEntity, (ula) => ula.post)
	postLikedByUsers?: UserLikePostEntity[];

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
	})
	updatedAt: Date;

	/*
	postId: 5,
	title: "Your most unhappy customers are your greatest source of learning",
	subtitle: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
	category: "Business, Travel",
	img : "/images/articles/img5.jpg",
	description: `
	Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic
	far World of Grammar.
	`,
	published: "Jun 14,  2022",
	author: {
		name: "Flying High",
		img: "/images/author/profile.jpeg",
		designation : "CEO and Founder"
	}
	*/
}
