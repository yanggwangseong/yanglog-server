import { UserEntity } from 'src/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('Post')
export class PostEntity {
	@PrimaryColumn('uuid')
	postId: string;

	@Column('varchar', { length: 120 })
	title: string;

	@Column('varchar', { length: 120 })
	subtitle: string;

	@Column('text')
	description: string;

	@Column('uuid')
	userId: string;

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

	@ManyToOne((type) => UserEntity, (user) => user.posts, { eager: false })
	user: UserEntity;

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
