import { Body, Controller, Get, Param, Post, Query, Headers, UseGuards, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { AuthGuard } from 'src/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
        ){}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void>{
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
    async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
        const { signupVerifyToken } = dto;
        
        return await this.userService.verifyEmail(signupVerifyToken);
    }

    @Post('/login')
    async login(@Body() dto: UserLoginDto): Promise<string> {
        const { email, password } = dto;

        return await this.userService.login(email, password);
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    async getUserInfo(@Headers() headers:any, @Param('id') userId: string): Promise<UserInfo> {
        //const jwtString = headers.authorization.split('Bearer ')[1];

        //this.authService.verify(jwtString); AuthGuard로 대체

        return await this.userService.getUserInfo(userId);
    }

    @UseGuards(AuthGuard)
    @Get('')
    async getUserAll(): Promise<UserEntity[]> {
        //const jwtString = headers.authorization.split('Bearer ')[1];

        //this.authService.verify(jwtString); AuthGuard로 대체

        return await this.userService.getUserAll();
    }

    
}
