import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationTypeEntity } from './entities/notification-type.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { CommentEntity } from '../comments/entities/comment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NotificationEntity,
			NotificationTypeEntity,
			PostEntity,
			CommentEntity,
		]),
	],
	controllers: [NotificationsController],
	providers: [NotificationsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
