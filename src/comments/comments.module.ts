import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { UserLikeCommentEntity } from 'src/users/entities/user-like-comment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CommentEntity, UserLikeCommentEntity])],
	controllers: [CommentsController],
	providers: [CommentsService],
	exports: [CommentsService],
})
export class CommentsModule {}
