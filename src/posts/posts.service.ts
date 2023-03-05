import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostEntity)
		private postsRepository: Repository<PostEntity>,
	) {}

	async createPost(userId: string, dto: CreatePostDto): Promise<void> {
		const post = new PostEntity();
		post.id = uuidv4();
		post.categoryId = dto.categoryId;
		post.title = dto.title;
		post.subtitle = dto.subtitle;
		post.description = dto.description;
		post.userId = userId;

		await this.postsRepository.save(post);
	}
}
