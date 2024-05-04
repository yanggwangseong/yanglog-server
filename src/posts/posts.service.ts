import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Like, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from './dto/create-post.dto';
import { PostType } from './interfaces/post.interface';
import { UserLikePostEntity } from 'src/users/entities/user-like-post.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostEntity)
		private postsRepository: Repository<PostEntity>,
		@InjectRepository(UserLikePostEntity)
		private userLikePostsRepository: Repository<UserLikePostEntity>,
	) {}

	async getPostById(postId: string, userId?: string): Promise<PostType> {
		const post = await this.postsRepository.findOne({
			select: {
				id: true,
				title: true,
				subtitle: true,
				imageUrn: true,
				description: true,
				updatedAt: true,
				category: {
					category_name: true,
				},
				user: {
					name: true,
					role: true,
				},
			},
			where: { id: postId },
			relations: ['category', 'user', 'postLikedByUsers'],
		});

		if (!post) throw new NotFoundException(`포스트가 존재하지 않습니다.`);

		if (userId) {
			post.setUserLike(userId);
		}

		return {
			id: post.id,
			title: post.title,
			subtitle: post.subtitle,
			category: post.category.category_name,
			img: post.imageUrn ? post.imageUrn : '',
			description: post.description,
			published: post.updatedAt,
			author: {
				name: post.user.name,
				img: '/images/author/profile.jpeg',
				designation: post.user.role,
			},
			likes: post.totalLikes,
			mylike: post.myLike,
		};
	}

	async searchPosts(keyword: string, option: string, sort: string) {
		let query = this.postsRepository
			.createQueryBuilder('a')
			.select([
				'a.id AS "id"',
				'a.title AS "title"',
				'a.subtitle AS "subtitle"',
				'category.category_name AS "category_name"',
				'a.imageUrn AS "img"',
				'a.description AS "description"',
				'a.updatedAt AS "published"',
				'user.name AS "name"',
				'user.role AS "role"',
			])
			.leftJoin('a.category', 'category')
			.leftJoin('a.user', 'user')
			.where('a.title LIKE :keyword', { keyword: `%${keyword}%` })
			.orderBy('a.updatedAt', 'ASC');

		const [list, count] = await Promise.all([
			query.getRawMany(),
			query.getCount(),
		]);

		return {
			list: list.map((post): PostType => {
				return {
					id: post.id,
					title: post.title,
					subtitle: post.subtitle,
					category: post.category_name,
					img: post.img,
					description: post.description,
					published: post.published,
					author: {
						name: post.name,
						img: '/images/author/profile.jpeg',
						designation: post.role,
					},
				};
			}),
			count,
		};
	}

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

	async updateLikesPostId(userId: string, postId: string) {
		const like = await this.userLikePostsRepository.findOneBy({
			userId,
			postId,
		});
		if (like) {
			await this.userLikePostsRepository.remove(like);
		} else {
			await this.userLikePostsRepository.save({ userId, postId });
		}
		return !like;
	}

	async getMainPosts() {
		const [trending, posts, popular, gptPosts] = await Promise.all([
			this.getTrendingPosts(),
			this.getPosts(),
			this.getPopular(),
			this.getChatgptPosts(),
		]);

		return {
			trending,
			posts,
			popular,
			gptPosts,
		};
	}

	async getTrendingPosts() {
		const trending = await this.postsRepository.find({
			relations: ['category', 'user'],
			skip: 0,
			take: 5,
			order: {
				updatedAt: 'ASC',
			},
		});

		return trending.map((trend) => {
			return {
				id: trend.id,
				title: trend.title,
				subtitle: trend.subtitle,
				category: trend.category.category_name,
				img: trend.imageUrn,
				description: trend.description,
				published: trend.updatedAt,
				author: {
					name: trend.user.name,
					img: '/images/author/profile.jpeg',
					designation: trend.user.role,
				},
			};
		});
	}

	async getPosts() {
		const posts = await this.postsRepository.find({
			relations: ['category', 'user'],
			skip: 5,
			take: 6,
		});

		return posts.map((post) => {
			return {
				id: post.id,
				title: post.title,
				subtitle: post.subtitle,
				category: post.category.category_name,
				img: post.imageUrn,
				description: post.description,
				published: post.updatedAt,
				author: {
					name: post.user.name,
					img: '/images/author/profile.jpeg',
					designation: post.user.role,
				},
			};
		});
	}

	async getPopular() {
		const populars = await this.postsRepository.find({
			relations: ['category', 'user'],
			skip: 10,
			take: 5,
		});

		return populars.map((popular) => {
			return {
				id: popular.id,
				title: popular.title,
				subtitle: popular.subtitle,
				category: popular.category.category_name,
				img: popular.imageUrn,
				description: popular.description,
				published: popular.updatedAt,
				author: {
					name: popular.user.name,
					img: '/images/author/profile.jpeg',
					designation: popular.user.role,
				},
			};
		});
	}

	async getChatgptPosts() {
		const gptPosts = await this.postsRepository.find({
			relations: ['category', 'user'],
			skip: 15,
			take: 5,
		});

		return gptPosts.map((gpt) => {
			return {
				id: gpt.id,
				title: gpt.title,
				subtitle: gpt.subtitle,
				category: gpt.category.category_name,
				img: gpt.imageUrn,
				description: gpt.description,
				published: gpt.updatedAt,
				author: {
					name: gpt.user.name,
					img: '/images/author/profile.jpeg',
					designation: gpt.user.role,
				},
			};
		});
	}
}
