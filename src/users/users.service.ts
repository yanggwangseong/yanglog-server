import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
@Injectable()
export class UsersService {
    constructor(
        private emailService: EmailService,
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        ){}
    
    async createUser(name: string, email: string, password: string) {
        await this.checkUserExists(email);

        const signupVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {

        throw new Error('Method not implemented.');
    }

    async login(email: string, password: string): Promise<string> {

        throw new Error('Method not implemented.');
    }

    async getUserInfo(userId: string): Promise<UserInfo> {

        throw new Error('Method not implemented.');
    }

    private checkUserExists(email: string) {
        return false;
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
        const user = new UserEntity();
        user.id = ulid();
        user.name = name;
        user.email = email;
        user.password = password;
        user.signiupVerifyToken = signupVerifyToken;
        await this.usersRepository.save(user);
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }


}
