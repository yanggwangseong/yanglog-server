import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
	imports: [JwtModule.register({})],
	controllers: [],
	providers: [AccessTokenStrategy, RefreshTokenStrategy],
	exports: [JwtModule],
})
export class AuthModule {}
