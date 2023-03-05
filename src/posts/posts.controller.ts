import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';

@Controller('posts')
@UseGuards(AccessTokenGuard)
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	async createPost(
		@CurrentUser('sub') sub: string,
		@Body() dto: CreatePostDto,
	): Promise<void> {
		this.postsService.createPost(sub, dto);
	}
}
