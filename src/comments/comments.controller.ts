import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('comments')
@UseGuards(AccessTokenGuard)
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post()
	async createComment(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreateCommentDto,
	): Promise<void> {
		this.commentsService.createComment(sub, dto);
	}
}
