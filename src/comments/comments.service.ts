import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { UserLikeCommentEntity } from 'src/users/entities/user-like-comment.entity';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentEntity)
		private commentsRepository: Repository<CommentEntity>,
		@InjectRepository(UserLikeCommentEntity)
		private userLikeCommentsRepository: Repository<UserLikeCommentEntity>,
	) {}

	async getAllComments(postId: string): Promise<CommentDto[]> {
		const comments = await this.commentsRepository.find({
			where: {
				parentId: IsNull(),
				postId: postId,
				// children_comments: {
				// 	comment_content: '자식댓글에댓글5',
				// },
			},
			relations: ['children_comments', 'user', 'commentLikedByUsers'],
			order: {
				updatedAt: 'ASC',
				children_comments: {
					updatedAt: 'ASC',
				},
			},
		});

		//comments.forEach((c) => c.setUserLike(c.userId));

		//TODO comment.entity에 userId를 이용하여 본인이 vote값 1또는 -1을 담는 객체 userVote에 담는다.
		const newComments = await Promise.all(
			comments.map(async (comment): Promise<CommentDto> => {
				const newChildComments = await Promise.all(
					comment.children_comments?.map(async (child): Promise<CommentDto> => {
						const [replyUserName, writeUserName, likes]: [
							string,
							string,
							number,
						] = await Promise.all([
							await this.getUserNameByCommentId(child.replyId),
							await this.getUserNameByCommentId(child.id),
							await this.userLikeCommentsRepository.count({
								where: { commentId: child.id },
							}),
						]);

						return {
							id: child.id,
							comment_content: child.comment_content,
							parentId: child.parentId,
							userId: child.userId,
							writer: writeUserName,
							likes: likes ? likes : 0,
							replyId: child.replyId,
							replyUserName: replyUserName,
							updatedAt: child.updatedAt,
						};
					}),
				);

				return {
					id: comment.id,
					comment_content: comment.comment_content,
					children_comments: newChildComments,
					userId: comment.userId,
					writer: comment.user.name,
					likes: comment.totalLikes,
					updatedAt: comment.updatedAt,
				};
			}),
		);

		return newComments;
	}

	async getUserNameByCommentId(commentId: string) {
		const comment = await this.commentsRepository.findOne({
			select: {
				user: {
					name: true,
				},
			},
			where: {
				id: commentId,
			},
			relations: ['user'],
		});

		return comment.user.name;
	}

	async createComment(userId: string, dto: CreateCommentDto): Promise<void> {
		const comment = new CommentEntity();
		comment.id = uuidv4();
		comment.comment_content = dto.comment_content;
		comment.parentId = dto.parentId;
		comment.postId = dto.postId;
		comment.userId = userId;
		comment.replyId = dto.replyId;

		await this.commentsRepository.save(comment);
	}

	async updateCommentById(
		commentId: string,
		dto: UpdateCommentDto,
	): Promise<void> {
		const comment = new CommentEntity();
		comment.comment_content = dto.comment_content;
		await this.commentsRepository.update({ id: commentId }, comment);
	}

	async deleteCommentById(commentId: string): Promise<void> {
		const result = await this.commentsRepository.delete({
			id: commentId,
		});

		if (result.affected === 0)
			throw new NotFoundException(
				`Could not find comment with id ${commentId}`,
			);
	}

	async updateLikesCommentId(userId: string, commentId: string) {
		const like = await this.userLikeCommentsRepository.findOneBy({
			userId,
			commentId,
		});
		if (like) {
			await this.userLikeCommentsRepository.remove(like);
		} else {
			await this.userLikeCommentsRepository.save({ userId, commentId });
		}
		return !like;
	}
}
