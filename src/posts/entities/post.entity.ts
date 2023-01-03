import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('Post')
export class PostEntity {
	@PrimaryColumn()
	postId: Number;

	@Column()
	title: string;

	@Column()
	description: string;

	// @Column()
	// status: BoardStatus;

	// @ManyToOne(type => User, user => user.boards, { eager: false})
	// user: User;

	@Column()
	userId: number;
}
