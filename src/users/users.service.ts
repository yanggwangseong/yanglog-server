import * as uuid from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Configuration, OpenAIApi } from 'openai';
import { AuthResponse } from './interfaces/auth.response.interface';

@Injectable()
export class UsersService {
	constructor(
		private emailService: EmailService,

		@InjectRepository(UserEntity)
		private usersRepository: Repository<UserEntity>,

		private dataSource: DataSource,

		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async verifyAccessToken(token: string): Promise<string> {
		try {
			const { sub }: { sub: string } = await this.jwtService.verifyAsync(
				token,
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
				},
			);

			return sub;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	}

	async createUser(name: string, email: string, password: string) {
		const userExist = await this.checkUserExists(email);
		if (userExist) {
			throw new UnprocessableEntityException(
				'해당 이메일로는 가입할 수 없습니다.',
			);
		}

		const signupVerifyToken = uuid.v1();

		const chkSaveUser = await this.saveUser(
			name,
			email,
			password,
			signupVerifyToken,
		);
		if (chkSaveUser) {
			await this.sendMemberJoinEmail(email, signupVerifyToken);
		}
	}

	async CreateGoogleUser(email: string, name: string) {
		const signupVerifyToken = uuid.v1();
		const password = uuid.v4();

		const user = new UserEntity();
		user.id = uuidv4();
		user.name = name;
		user.email = email;
		user.password = password;
		user.signupVerifyToken = signupVerifyToken;
		user.refreshToken = '';

		const createUser = await this.usersRepository.save(user);

		return {
			userId: createUser.id,
		};
	}
	async signInGoogleUser(email: string) {
		const user = await this.usersRepository.findOne({
			where: {
				email: email,
			},
		});

		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);

		return {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
		};
	}

	async verifyEmail(
		signupVerifyToken: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const user = await this.usersRepository.findOneBy({
			signupVerifyToken: signupVerifyToken,
		});

		if (!user) {
			throw new NotFoundException('유저가 존재하지 않습니다.');
		}

		// return this.authService.login({
		// 	id: user.id,
		// 	name: user.name,
		// 	email: user.email,
		// });
		const tokens = await this.getTokens(user.id, user.name, user.role);
		return tokens;
	}

	async signin(email: string, password: string): Promise<AuthResponse> {
		const user = await this.usersRepository.findOneBy({
			email: email,
			password: password,
		});

		if (!user) {
			throw new NotFoundException('유저가 존재하지 않습니다.');
		}
		//await this.testAI();

		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return {
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}

	async testAI() {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		});
		const openai = new OpenAIApi(configuration);
		const city = 'New York';
		const topic = `Top 10 Restaurants you must visit when traveling to ${city}`;
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: `Write blog posts in markdown format.
			Write the theme of your blog as ${topic}.
			Highlight, bold, or italicize important words or sentences.
			Please include the restaurant's address, menu recommendations and other helpful information(opening and closing hours) as a list style.
			Please make the entire blog less than 10 minutes long.
			The audience of this article is 20-40 years old.
			Create several hashtags and add them only at the end of the line.
			Add a summary of the entire article at the beginning of the blog post`,
			//temperature: 0,
			max_tokens: 2048,
			//top_p: 0,
			//frequency_penalty: 0,
			//presence_penalty: 0,
			temperature: 0.3,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		console.log(completion.data.choices[0].text);
	}

	async logout(id: string) {
		this.updateRefreshToken(id, null);
		return { logout: true };
	}

	async updateRefreshToken(id: string, refreshToken: string) {
		const user = await this.usersRepository.findOneBy({ id: id });
		let hashedRefreshToken = '';
		if (refreshToken !== null) {
			hashedRefreshToken = await this.hashData(refreshToken);
		}
		user.refreshToken = hashedRefreshToken;
		await this.usersRepository.save(user);
	}

	async hashData(refreshToken: string) {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(refreshToken, salt);
	}

	async getTokens(id: string, name: string, role: UserRole) {
		const [accessToken, refreshToken]: [string, string] = await Promise.all([
			await this.jwtService.signAsync(
				{
					sub: id,
					username: name,
					role: role,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: '5m',
				},
			),
			await this.jwtService.signAsync(
				{
					sub: id,
					username: name,
					role: role,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: '7d',
				},
			),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	async refreshTokens(id: string, refreshToken: string) {
		const user = await this.usersRepository.findOneBy({ id: id });
		if (!user || !user.refreshToken) {
			throw new NotFoundException('유저가 존재하지 않습니다.');
		}
		const refreshTokenMatches = await bcrypt.compare(
			refreshToken,
			user.refreshToken,
		);
		if (!refreshTokenMatches)
			throw new NotFoundException('유저가 존재하지 않습니다.');
		const tokens = await this.getTokens(user.id, user.name, user.role);
		await this.updateRefreshToken(user.id, tokens.refreshToken);
		return tokens;
	}

	async checkUser(id: string) {
		const user = await this.usersRepository.findOneBy({ id: id });
		if (!user) {
			throw new NotFoundException('유저가 존재하지 않습니다.');
		}
		return true;
	}

	async getUserInfo(userId: string): Promise<UserInfo> {
		const user = await this.usersRepository.findOneBy({ id: userId });

		if (!user) {
			throw new NotFoundException('유저가 존재하지 않습니다');
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
		};
	}

	async checkUserExists(emailAddress: string): Promise<boolean> {
		const user = await this.usersRepository.findOneBy({ email: emailAddress });

		return user !== null;
	}

	private async saveUser(
		name: string,
		email: string,
		password: string,
		signupVerifyToken: string,
	) {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = new UserEntity();
			user.id = uuidv4();
			user.name = name;
			user.email = email;
			user.password = password;
			user.signupVerifyToken = signupVerifyToken;
			user.refreshToken = '';

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
		await this.emailService.sendMemberJoinVerification(
			email,
			signupVerifyToken,
		);
	}
}
