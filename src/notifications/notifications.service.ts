import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class NotificationsService {
	constructor(
		private postsService: PostsService,
		@InjectRepository(NotificationEntity)
		private notificationsRepository: Repository<NotificationEntity>,
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
					sendDate: item.createdAt,
					sender: item.sender.name,
					senderImg: '/images/author/profile.jpeg',
				};
			}),
			count,
		};
	}

	async sendPostCommentNotification(postId: string, userId: string) {
		const recipientId = await this.postsService.getUserIdByPostId(postId);

		await this.notificationsRepository.save({
			id: uuidv4(),
			recipientId: recipientId,
			senderId: userId,
			notification_title: '내 게시물에 새로운 댓글이 달렸습니다.',
			postId: postId,
			notifaction_description: '내 게시물에 댓글을 작성 하였습니다.',
			typeId: '96ebc4bc-e2f0-4707-9d11-a4af1396f3b5',
		});
	}

	//[Todo]sendPostCommentNotification : 게시글에 코멘트를 작성 했을 때 게시글 작성자에게 알림을 보냅니다.

	//[Todo]sendReplyCommentNotification : 게시글에 코멘트를 작성 했을 때 게시글 작성자에게 알림을 보냅니다.
}
