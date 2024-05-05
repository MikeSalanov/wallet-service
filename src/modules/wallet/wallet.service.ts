import * as ethers from 'ethers';
import { AbstractProvider, BaseContract, ContractInterface } from 'ethers';
import { Get, Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from "@nestjs/config";
import { Wallet } from "./entities/wallet.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as crypto from 'crypto';

@Injectable()
export class WalletService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) {}
  
  @RabbitSubscribe({
    exchange: 'USER_REGISTRATION',
    routingKey: 'REGISTRATION',
    queue: 'USER_REGISTERED'
  })
  public async generateEthereumWallet(message: { message: string, user_id: string }): Promise<void> {
    console.log('message:', message, message.user_id);
    try {
      const foundUserWalletData = await this.walletRepository.findOne({
        where: {
          user_id: message.user_id
        }
      });
      if (foundUserWalletData.publicAddress !== undefined) return;
      const provider: AbstractProvider = ethers.getDefaultProvider('homestead');
      const wallet: ethers.HDNodeWallet =
        ethers.Wallet.createRandom().connect(provider);
      console.log('New wallet:', {
        publicAddress: wallet.address,
        privateAddress: wallet.privateKey,
      });
      const userWallet: Wallet = this.walletRepository.create({
        id: crypto.randomUUID(),
        publicAddress: wallet.address,
        privateAddress: wallet.privateKey,
        user_id: message.user_id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await this.walletRepository.save(userWallet);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
  
  @Get()
  async toGetBalanceOfUSDStableCoin(userId: string): Promise<number> {
    const provider: AbstractProvider = ethers.getDefaultProvider('homestead');
    const usdtContract: BaseContract &
      Omit<ContractInterface, keyof BaseContract> = new ethers.Contract(
      this.configService.get<string>('USDTERC20_CONTRACT_ADDRESS'),
      ['function balanceOf(address owner) view returns (uint256)'],
      provider,
    );
    try {
      const walletData = await this.walletRepository.findOne({
        where: {
          user_id: userId
        }
      });
      const balance: string = await usdtContract.balanceOf(walletData.publicAddress);
      console.log(`Balance: ${ethers.formatUnits(balance, 6)} USDT`);
      return Number.parseFloat(ethers.formatUnits(balance, 6));
    } catch (e) {
      console.error('Error of getting balance');
    }
    return 0;
  }
}
