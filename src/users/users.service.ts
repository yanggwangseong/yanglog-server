import * as uuid from 'uuid';
import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { ulid } from 'ulid';
@Injectable()
export class UsersService {
    constructor(
        private emailService: EmailService,
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
        private dataSource: DataSource,
        ){}
    
    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);
        if (userExist) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }

        const signupVerifyToken = uuid.v1();

        const chkSaveUser = await this.saveUser(name, email, password, signupVerifyToken);
        if(chkSaveUser){
            await this.sendMemberJoinEmail(email, signupVerifyToken);
        }
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

    private async checkUserExists(emailAddress: string): Promise<boolean> {
        const user = await this.usersRepository.findOneBy({email: emailAddress});

        return user !== null;
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signiupVerifyToken = signupVerifyToken;

            //await this.usersRepository.save(user);
            await queryRunner.manager.save(user);
            //트랜잭션 테스트 위한 에러발생
            //throw new InternalServerErrorException();
            await queryRunner.commitTransaction();

        } catch (e) {
            //error
            //console.log("에러발생체크");
            await queryRunner.rollbackTransaction();
            return false;
        } finally {
            await queryRunner.release();
        }

        return true;
        
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }


}
