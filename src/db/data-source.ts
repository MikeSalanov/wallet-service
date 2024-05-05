import { DataSource } from 'typeorm';
import { resolve } from 'path';
import {config} from "dotenv";
import { ConfigService } from "@nestjs/config";

config();

const configService: ConfigService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST') || 'localhost',
  port: configService.get('DB_PORT') || 5433,
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  migrations: [resolve(__dirname + '/../migrations/*.{js,ts}')],
  entities: [resolve(__dirname + '/../**/*.entity.{js,ts}')],
  logging: 'all',
  synchronize: false,
});
