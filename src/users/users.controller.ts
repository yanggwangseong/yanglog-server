import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	Headers,
	UseGuards,
	Inject,
	Req,
	Res,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserEntity, UserRole } from './entities/user.entity';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { refreshTokenGuard } from 'src/guards/refreshToken.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthResponse } from './interfaces/auth.response.interface';

@Controller('users')
export class UsersController {
	constructor(
		private userService: UsersService,

		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
	) {}

	@Post()
	async createUser(@Body() dto: CreateUserDto): Promise<void> {
		this.printWinstonLog(dto);
		const { name, email, password } = dto;
		await this.userService.createUser(name, email, password);
	}

	private printWinstonLog(dto: CreateUserDto) {
		//console.log(this.logger.name);

		this.logger.error('error: ', dto);
		this.logger.warn('warn: ', dto);
		this.logger.info('info: ', dto);
		this.logger.http('http: ', dto);
		this.logger.verbose('verbose: ', dto);
		this.logger.debug('debug: ', dto);
		this.logger.silly('silly: ', dto);
	}

	@Post('/email-verify')
	async verifyEmail(
		@Query() dto: VerifyEmailDto,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { signupVerifyToken } = dto;

		return await this.userService.verifyEmail(signupVerifyToken);
	}

	//new
	@Post('/signin')
	async signin(
		@Res({ passthrough: true }) res: Response,
		@Body() dto: UserLoginDto,
	): Promise<AuthResponse> {
		this.logger.error('error: ', dto);
		const { email, password } = dto;
		const response = await this.userService.signin(email, password);
		res.cookie('Authentication', response.refreshToken, {
			domain: 'localhost',
			path: '/',
			httpOnly: true,
		});

		return {
			accessToken: response.accessToken,
			id: response.id,
			email: response.email,
			name: response.name,
		};
	}

	//new
	@UseGuards(AccessTokenGuard)
	@Post('/logout')
	logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	): Promise<{ logout: boolean }> {
		console.log('test');
		res.clearCookie('Authentication', {
			domain: 'localhost',
			path: '/',
			httpOnly: true,
		});
		return this.userService.logout(req.user['sub']);
	}

	//new
	@UseGuards(refreshTokenGuard)
	@Get('/refreshtoken')
	async refreshTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
	) {
		const id = req.user['sub'];
		const refreshToken = req.user['refreshToken'];

		const tokens = await this.userService.refreshTokens(id, refreshToken);
		res.cookie('Authentication', tokens.refreshToken, {
			domain: 'localhost',
			path: '/',
			httpOnly: true,
		});

		return { accessToken: tokens.accessToken };
	}

	//@Roles('admin', 'user')
	//@Roles(UserRole.ADMIN)
	//@UseGuards(AccessTokenGuard, RolesGuard)
	@UseGuards(AccessTokenGuard)
	@Get('/checkUser')
	async checkUser(@Req() req: Request) {
		const id = req.user['sub'];
		//const user = await this.userService.checkUser(id);

		return await this.userService.getUserInfo(id);
	}

	@UseGuards(AccessTokenGuard)
	@Get('/:id')
	async getUserInfo(
		@Headers() headers: any,
		@Param('id') userId: string,
	): Promise<UserInfo> {
		//const jwtString = headers.authorization.split('Bearer ')[1];

		//this.authService.verify(jwtString); AuthGuard로 대체

		return await this.userService.getUserInfo(userId);
	}
}
