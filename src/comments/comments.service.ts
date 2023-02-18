import { Injectable } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity)
		private commentsRepository: Repository<CommentEntity>,
	) {}

	async createComment(userId: string, dto: CreateCommentDto): Promise<void> {
		const comment = new CommentEntity();
		comment.id = uuidv4();
		comment.comment_content = dto.comment_content;
		comment.parentId = dto.parentId;
		comment.postId = dto.postId;
		comment.userId = userId;

		await this.commentsRepository.save(comment);
	}
}
