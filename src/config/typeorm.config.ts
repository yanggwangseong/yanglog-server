import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'yanglog',
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	migrations: [__dirname + '/../../db/migrations/*{.ts,.js}'],
	//logging: ['query'],
	synchronize: true,
};

// const dataSource = new DataSource(typeORMConfig);
// export default dataSource;
