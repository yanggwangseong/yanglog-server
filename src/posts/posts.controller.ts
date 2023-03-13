import {
	Controller,
	Get,
	Post,
	Body,
	UseGuards,
	Param,
	Put,
	Delete,
	Req,
	Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CommentsService } from 'src/comments/comments.service';
import { CommentDto } from 'src/comments/dto/comment.dto';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly commentsService: CommentsService,
		private readonly usersService: UsersService,
	) {}

	@Get('main')
	async getMainPosts() {
		return await this.postsService.getMainPosts();
	}

	@Get('search')
	async searchPosts(
		@Query('keyword') keyword: string,
		@Query('option') option: string,
		@Query('sort') sort: string,
	) {
		const searchResults = await this.postsService.searchPosts(
			keyword,
			option,
			sort,
		);
		return searchResults;
	}

	@Get(':postId')
	async getPostById(@Param('postId') postId: string, @Req() req: Request) {
		const authorizationHeader = req.headers['authorization'];
		if (authorizationHeader) {
			const [, token] = authorizationHeader.split(' ');
			const sub = await this.usersService.verifyAccessToken(token);
			return await this.postsService.getPostById(postId, sub);
		}

		return await this.postsService.getPostById(postId);
	}

	@UseGuards(AccessTokenGuard)
	@Put(':postId/likes')
	async updateLikesPostId(
		@CurrentUser('sub') sub: string,
		@Param('postId') postId: string,
	) {
		return await this.postsService.updateLikesPostId(sub, postId);
	}

	@UseGuards(AccessTokenGuard)
	@Post()
	async createPost(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreatePostDto,
	): Promise<void> {
		await this.postsService.createPost(sub, dto);
	}

	@Get(':postId/comments')
	async getAllComments(
		@Param('postId') postId: string,
		@Req() req: Request,
	): Promise<CommentDto[]> {
		const authorizationHeader = req.headers['authorization'];
		if (authorizationHeader) {
			const [, token] = authorizationHeader.split(' ');
			const sub = await this.usersService.verifyAccessToken(token);
			return await this.commentsService.getAllComments(postId, sub);
		}

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

	@UseGuards(AccessTokenGuard)
	@Put(':postId/comments/:commentId/likes')
	async updateLikesCommentId(
		@CurrentUser('sub') sub: string,
		@Param('commentId') commentId: string,
		@Body('value') value: number,
	) {
		return await this.commentsService.updateLikesCommentId(
			sub,
			commentId,
			value,
		);
	}
}
