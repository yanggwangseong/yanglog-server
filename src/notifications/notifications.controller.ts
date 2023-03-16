import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { CurrentUser } from '../decorators/user.decorator';

@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Get()
	async getNotificationAll(@CurrentUser('sub') sub: string) {
		return this.notificationsService.getNotificationAll(sub);
	}
}
