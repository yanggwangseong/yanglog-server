import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Controller('comments')
@UseGuards(AccessTokenGuard)
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Get(':postId')
	async getAllCategory(
		@Param('postId') postId: string,
	): Promise<CommentEntity[]> {
		return this.commentsService.getAllCategory(postId);
	}

	@Post()
	async createComment(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreateCommentDto,
	): Promise<void> {
		this.commentsService.createComment(sub, dto);
	}

	@Put(':commentId')
	async updateCommentById(
		@Param('commentId') commentId: string,
		@Body() dto: UpdateCommentDto,
	): Promise<void> {
		this.commentsService.updateCommentById(commentId, dto);
	}

	@Delete(':commentId')
	async deleteCommentById(
		@Param('commentId') commentId: string,
	): Promise<void> {
		this.commentsService.deleteCommentById(commentId);
	}
}
