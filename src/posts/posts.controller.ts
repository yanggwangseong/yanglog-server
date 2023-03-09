import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Param,
	Put,
	Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CommentsService } from 'src/comments/comments.service';
import { CommentDto } from 'src/comments/dto/comment.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly commentsService: CommentsService,
	) {}

	@Get('main')
	async getMainPosts() {
		return await this.postsService.getMainPosts();
	}

	@Get(':postId')
	async getPostById(@Param('postId') postId: string) {
		return await this.postsService.getPostById(postId);
	}

	//[TODO] post like
	@Put('update-likes/:postId')
	async updateLikesPostId() {}

	@UseGuards(AccessTokenGuard)
	@Post()
	async createPost(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreatePostDto,
	): Promise<void> {
		await this.postsService.createPost(sub, dto);
	}

	@Get(':postId/comments')
	async getAllComments(@Param('postId') postId: string): Promise<CommentDto[]> {
		return await this.commentsService.getAllComments(postId);
	}

	@UseGuards(AccessTokenGuard)
	@Post(':postId/comments')
	async createComment(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreateCommentDto,
	): Promise<void> {
		this.commentsService.createComment(sub, dto);
	}

	@UseGuards(AccessTokenGuard)
	@Put(':postId/comments/:commentId')
	async updateCommentById(
		@Param('commentId') commentId: string,
		@Body() dto: UpdateCommentDto,
	): Promise<void> {
		this.commentsService.updateCommentById(commentId, dto);
	}

	@UseGuards(AccessTokenGuard)
	@Delete(':postId/comments/:commentId')
	async deleteCommentById(
		@Param('commentId') commentId: string,
	): Promise<void> {
		this.commentsService.deleteCommentById(commentId);
	}

	//[TODO] comment like
	@UseGuards(AccessTokenGuard)
	@Put(':postId/comments/update-likes/:commentId')
	async updateLikesCommentId() {}
}
