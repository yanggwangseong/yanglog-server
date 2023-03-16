import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationTypeEntity } from './entities/notification-type.entity';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { PostEntity } from '../posts/entities/post.entity';
import { UserLikePostEntity } from '../users/entities/user-like-post.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			NotificationEntity,
			NotificationTypeEntity,
			PostEntity,
			UserLikePostEntity,
		]),
	],
	controllers: [NotificationsController],
	providers: [NotificationsService, PostsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
