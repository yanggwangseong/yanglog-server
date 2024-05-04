import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import {
	AlarmType,
	NotificationTypeEntity,
} from './entities/notification-type.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { CommentEntity } from '../comments/entities/comment.entity';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectRepository(PostEntity)
		private postsRepository: Repository<PostEntity>,
		@InjectRepository(CommentEntity)
		private commentsRepository: Repository<PostEntity>,
		@InjectRepository(NotificationEntity)
		private notificationsRepository: Repository<NotificationEntity>,
		@InjectRepository(NotificationTypeEntity)
		private notificationTypeRepository: Repository<NotificationTypeEntity>,
	) {}

	async getNotificationAll(userId: string) {
		const [list, count] = await this.notificationsRepository.findAndCount({
			select: {
				id: true,
				notification_title: true,
				notifaction_description: true,
				postId: true,
				senderId: true,
				createdAt: true,
				sender: {
					name: true,
				},
			},
			relations: ['sender'],
			where: {
				recipientId: userId,
			},
		});

		return {
			list: list.map((item) => {
				return {
					id: item.id,
					title: item.notification_title,
					description: `${item.sender.name}님께서 ${item.notifaction_description}`,
					postId: item.postId,
					sendDate: item.createdAt,
					sender: item.sender.name,
					senderImg: '/images/author/profile.jpeg',
				};
			}),
			count,
		};
	}

	async sendPostCommentNotification(postId: string, userId: string) {
		const typeId = await this.getNotificationTypeById(
			AlarmType.CommentOnMyPost,
		);

		const recipientId = await this.postsRepository.findOne({
			select: {
				userId: true,
			},
			where: {
				id: postId,
			},
		});

		if (!recipientId) {
			throw new NotFoundException('게시글 ID에 해당하는 유저ID가 없습니다.');
		}

		await this.notificationsRepository.save({
			id: uuidv4(),
			recipientId: recipientId.userId,
			senderId: userId,
			notification_title: '내 게시물에 새로운 댓글이 달렸습니다.',
			postId: postId,
			notifaction_description: '내 게시물에 댓글을 작성 하였습니다.',
			typeId: typeId,
		});
	}

	async sendReplyCommentNotification(
		postId: string,
		userId: string,
		replyId: string,
	) {
		//commentId로 해당 comment 작성자의 userId를 구함.
		const recipientId = await this.commentsRepository.findOne({
			select: {
				userId: true,
			},
			where: {
				id: replyId,
			},
		});
		if (!recipientId) {
			throw new NotFoundException('게시글 ID에 해당하는 유저ID가 없습니다.');
		}
		const typeId = await this.getNotificationTypeById(
			AlarmType.ReplyOnMyComment,
		);
		await this.notificationsRepository.save({
			id: uuidv4(),
			recipientId: recipientId.userId,
			senderId: userId,
			notification_title: '내 댓글에 새로운 답글이 달렸습니다.',
			postId: postId,
			notifaction_description: '내 댓글에 답글을 작성 하였습니다.',
			typeId: typeId,
		});
	}

	private async getNotificationTypeById(alramType: AlarmType) {
		const type = await this.notificationTypeRepository.findOne({
			select: {
				id: true,
			},
			where: {
				type: alramType,
			},
		});

		if (!type) {
			throw new NotFoundException('해당하는 알람 타입이 존재 하지 않습니다.');
		}

		return type.id;
	}
}
