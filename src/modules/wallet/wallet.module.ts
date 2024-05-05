import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./entities/wallet.entity";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => ({
          exchanges: [
            {
              name: 'USER_REGISTRATION',
              type: 'direct',
            },
          ],
          uri: 'amqp://guest:guest@localhost',
          connectionInitOptions: { wait: false, reject: false },
          enableControllerDiscovery: true,
          queues: [
            {
              name: 'USER_REGISTERED',
              options: {
                durable: true
              }
            },
          ],
        })
      }),
    TypeOrmModule.forFeature([Wallet])
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
