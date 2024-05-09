import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from "@nestjs/config";
import { WalletModule } from './modules/wallet/wallet.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { Migrations1714850783210 as CreateWalletsTable } from './migrations/1714850783210-migrations';
import * as path from "path";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    WalletModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT') || 5433,
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        migrations: [CreateWalletsTable],
        entities: [path.resolve(__dirname, './modules/wallet/entities/*.entity{.js,.ts}')],
        logging: 'all',
        autoLoadEntities: true,
        migrationsRun: true,
        synchronize: false,
      }),
    }),
    HttpModule
  ],
})
export class AppModule {}
