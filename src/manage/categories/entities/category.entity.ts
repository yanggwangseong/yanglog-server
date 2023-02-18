import { PostEntity } from 'src/posts/entities/post.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('Category')
export class CategoryEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column('varchar', { length: 100 })
	category_name: string;

	@Column({ type: 'int', width: 11 })
	priority: number;

	@Column({ nullable: true })
	parentId: string;

	@ManyToOne(() => CategoryEntity, (category) => category.children)
	parent: CategoryEntity;

	@OneToMany(() => CategoryEntity, (category) => category.parent)
	children: CategoryEntity[];

	@OneToMany((type) => PostEntity, (post) => post.categoryId, { eager: true })
	posts: PostEntity[];

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
}
