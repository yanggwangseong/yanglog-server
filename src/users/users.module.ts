import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
