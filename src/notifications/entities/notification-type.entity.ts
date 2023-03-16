import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	Unique,
} from 'typeorm';
import { NotificationEntity } from './notification.entity';

export enum AlarmType {
	CommentOnMyPost = 'comment_on_my_post',
	LikeOnMyPost = 'like_on_my_post',
	UnlikeOnMyPost = 'unlike_on_my_post',
	ReplyOnMyComment = 'reply_on_my_comment',
	LikeOnMyComment = 'like_on_my_comment',
	UnlikeOnMyComment = 'unlike_on_my_comment',
}

@Entity({ name: 'notification_type' })
@Unique(['type'])
export class NotificationTypeEntity {
	@PrimaryColumn('uuid')
	id!: string;

	@Column({
		type: 'enum',
		enum: AlarmType,
	})
	type!: AlarmType;

	@OneToMany(() => NotificationEntity, (n) => n.type)
	Notifications!: NotificationEntity[];

	@CreateDateColumn({
		type: 'timestamp',
		precision: 3,
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt!: Date;
}
