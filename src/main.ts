import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SuccessInterceptor } from './interceptors';

dotenv.config({
	path: path.resolve(
		process.env.NODE_ENV === 'production'
			? '.production.env'
			: process.env.NODE_ENV === 'stage'
			? '.stage.env'
			: '.development.env',
	),
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const options = {
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: false,
		credentials: true,
		allowedHeaders: 'Content-Type, Accept, Authorization',
	};
	app.enableCors(options);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);
	//app.useGlobalInterceptors(new SuccessInterceptor());
	//cookieParser
	app.use(cookieParser());
	await app.listen(3001);
}

bootstrap();
