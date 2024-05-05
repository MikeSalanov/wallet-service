import { Controller, Get, HttpCode, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from "../../auth/jwtAuth.guard";
import RequestWithUserIdInterface from '../../interfaces/RequestWithUserId.interface';

@ApiTags('wallet-controller')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @HttpCode(200)
  @Get('/balance')
  getBalance(@Request() req: RequestWithUserIdInterface) {
    return this.walletService.toGetBalanceOfUSDStableCoin(req.user_id);
  }
}
