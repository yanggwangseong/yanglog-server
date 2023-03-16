import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { NotificationTypeEntity } from './notification-type.entity';

@Entity({ name: 'notification' })
export class NotificationEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column('varchar', { length: 60 })
	notification_title!: string;

	@Column('varchar', { length: 100 })
	notifaction_description!: string;

	@Column('uuid')
	public readonly recipientId!: string;

	@Column('uuid')
	public readonly senderId!: string;

	@Column('uuid')
	public readonly typeId!: string;

	@ManyToOne(() => NotificationTypeEntity, (type) => type.Notifications)
	@JoinColumn({ name: 'typeId', referencedColumnName: 'id' })
	type!: NotificationTypeEntity;

	@ManyToOne(() => UserEntity, (user) => user.userRecipients)
	@JoinColumn({ name: 'recipientId', referencedColumnName: 'id' })
	recipient!: UserEntity;

	@ManyToOne(() => UserEntity, (user) => user.userSenders)
	@JoinColumn({ name: 'senderId', referencedColumnName: 'id' })
	sender!: UserEntity;

	@Column('uuid', { nullable: true })
	postId?: string;

	@Column('uuid', { nullable: true })
	commentId?: string;

	@Column('boolean', { default: false })
	isRead!: boolean;

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
}
