import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { CommentsModule } from 'src/comments/comments.module';
import { UserLikePostEntity } from 'src/users/entities/user-like-post.entity';
import { UserLikeCommentEntity } from 'src/users/entities/user-like-comment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostEntity, UserLikePostEntity]),
		CommentsModule,
	],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}
