import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDto } from './dto/comment.dto';
import { UserLikeCommentEntity } from 'src/users/entities/user-like-comment.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
	constructor(
		private dataSource: DataSource,
		private notificationsService: NotificationsService,
		@InjectRepository(CommentEntity)
		private commentsRepository: Repository<CommentEntity>,
		@InjectRepository(UserLikeCommentEntity)
		private userLikeCommentsRepository: Repository<UserLikeCommentEntity>,
	) {}

	async getAllComments(postId: string, userId?: string): Promise<CommentDto[]> {
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

		if (userId) {
			comments.forEach((c) => c.setUserLike(userId));
		}

		const newComments = await Promise.all(
			comments.map(async (comment): Promise<CommentDto> => {
				const newChildComments = await Promise.all(
					comment.children_comments?.map(async (child): Promise<CommentDto> => {
						const [replyUserName, writeUserName, likes] = await Promise.all([
							child.replyId
								? await this.getUserNameByCommentId(child.replyId)
								: '',
							await this.getUserNameByCommentId(child.id),
							this.userLikeCommentsRepository
								.createQueryBuilder('ula')
								.select('SUM(ula.value)', 'TotalLike')
								.where('ula.commentId = :commentId', { commentId: child.id })
								.getRawOne(),
						]);

						let value: number = 0;
						if (userId) {
							value = await this.getUserLikeCommentValue(userId, child.id);
						}

						return {
							id: child.id,
							comment_content: child.comment_content,
							parentId: child.parentId,
							userId: child.userId,
							writer: writeUserName,
							likes: likes.TotalLike ? likes.TotalLike : 0,
							mylike: value,
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
					mylike: comment.myLike,
					updatedAt: comment.updatedAt,
				};
			}),
		);

		return newComments;
	}

	private async getUserNameByCommentId(commentId: string) {
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

		if (!comment) throw new NotFoundException('댓글이 존재 하지 않습니다.');

		return comment.user.name;
	}

	private async getUserLikeCommentValue(userId: string, commentId: string) {
		const value = await this.userLikeCommentsRepository.findOne({
			where: { userId: userId, commentId: commentId },
		});

		return value ? value.value : 0;
	}

	async createComment(userId: string, dto: CreateCommentDto): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		try {
			const comment = new CommentEntity();
			comment.id = uuidv4();
			comment.comment_content = dto.comment_content;
			comment.parentId = dto.parentId;
			comment.postId = dto.postId;
			comment.userId = userId;
			comment.replyId = dto.replyId;

			await queryRunner.manager.save(comment);

			//트랜잭션 테스트 위한 에러발생
			//throw new InternalServerErrorException();
			if (comment.replyId) {
				this.notificationsService.sendReplyCommentNotification(
					comment.postId,
					userId,
					comment.replyId,
				);
			} else {
				this.notificationsService.sendPostCommentNotification(
					dto.postId,
					userId,
				);
			}
			await queryRunner.commitTransaction();
		} catch (e) {
			console.log(e);
			await queryRunner.rollbackTransaction();
			throw e;
			//return false;
		} finally {
			await queryRunner.release();
		}
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

		if (result.affected === 0) {
			throw new NotFoundException(
				`Could not find comment with id ${commentId}`,
			);
		}
	}

	async updateLikesCommentId(userId: string, commentId: string, value: number) {
		const like = await this.userLikeCommentsRepository.findOneBy({
			userId,
			commentId,
		});

		const newlike = await this.userLikeCommentsRepository.save({
			userId,
			commentId,
			value,
		});

		return newlike.value === 1 ? true : false;
	}
}
