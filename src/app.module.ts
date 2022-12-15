import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PostsModule } from './posts/posts.module';
import authConfig from './config/authConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [],
  providers: [AuthService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'users', method: RequestMethod.GET },) //exclude함수는 미들웨어를 적용하지 않을 라우팅 경로를 설정. ex) /users GET 요청은 적용x
      .forRoutes(UsersController); //'/users'
  }
}
