import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        EmailModule,
        AuthModule,
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
