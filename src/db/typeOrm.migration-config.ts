import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { PetEntity } from './entities/pet.entity';
import { TutorEntity } from './entities/tutor.entity';
config();

const configService = new ConfigService();

const options: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('POSTGRES_HOST'),
  port: configService.get<number>('POSTGRES_PORT', 5432),
  username: configService.get<string>('POSTGRES_USER'),
  password: configService.get<string>('POSTGRES_PASSWORD'),
  database: configService.get<string>('POSTGRES_DB'),
  entities: [PetEntity, TutorEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(options);
