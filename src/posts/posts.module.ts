import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommentsModule } from 'src/comments/comments.module';
import { UserLikePostEntity } from 'src/users/entities/user-like-post.entity';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostEntity, UserLikePostEntity]),
		CommentsModule,
		UsersModule,
		NotificationsModule,
	],
	controllers: [PostsController],
	providers: [PostsService],
	exports: [PostsService],
})
export class PostsModule {}
