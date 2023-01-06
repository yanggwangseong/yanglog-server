import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [EmailModule, TypeOrmModule.forFeature([UserEntity])],
	controllers: [UsersController],
	providers: [UsersService, JwtService],
})
export class UsersModule {}
