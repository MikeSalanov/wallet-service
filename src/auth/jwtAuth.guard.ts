import {Injectable, CanActivate, UnauthorizedException, ExecutionContext} from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from "rxjs";
import * as jwt from 'jsonwebtoken';
import DecodedJwtObjectInterface from "../interfaces/DecodedJwtObject.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private httpService: HttpService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const authHeader: string = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Authorization header is missing.');
    const accessToken: string = authHeader.split(' ')[1];
    if (await this.validateToken(accessToken)) {
      const jwtDecodedObj: unknown = jwt.decode(accessToken);
      console.log(jwtDecodedObj);
      request['user_id'] = (jwtDecodedObj as DecodedJwtObjectInterface).user_id;
      return true;
    }
    throw new UnauthorizedException('Invalid access token');
  }
  
  private async validateToken(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.AUTH_SERVICE_URL}/auth-service/token/validate`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      return response.data.isValid;
    } catch(err) {
      throw new UnauthorizedException('Error validating token.')
    }
  }
}
