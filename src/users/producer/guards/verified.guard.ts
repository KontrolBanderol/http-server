import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
  
  @Injectable()
  export class VerifiedGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
        ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const userModel = await this.usersService.getUser({ id: request.user.id });
      if (!userModel || !userModel.verified) {
        throw new UnauthorizedException({
          message: 'Producer is not verified',
        });
      }
      return true;
    }
  }