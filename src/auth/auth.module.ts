import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
	imports: [JwtModule.register({})],
	controllers: [],
	providers: [AccessTokenStrategy, RefreshTokenStrategy, GoogleStrategy],
	exports: [JwtModule],
})
export class AuthModule {}
