import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verify } from 'jsonwebtoken';

export class UserAuthGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  private throwBasicAuth() {
    throw new UnauthorizedException(
      'Execpected Authorization type to be Bearer Auth',
    );
  }
  private throwInvalidSession() {
    throw new UnauthorizedException('Invalid Session');
  }

  private throwSessionExpired() {
    throw new UnauthorizedException('Session Expired');
  }
  private throwMissing() {
    throw new UnauthorizedException('Session Expired');
  }

  private parsedVal(data: any) {
    try {
      return JSON.parse(Buffer.from(data, 'base64').toString());
    } catch (e) {
      this.throwMissing();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    // check if Public
    const IsPublic = this.reflector.get<boolean>(
      'IsPublic',
      context.getHandler(),
    );
    if (IsPublic) return true;

    if (!headers.authorization) this.throwInvalidSession();

    const [type, jwt] = headers.authorization.split(' ');
    if (type !== 'Bearer' || !jwt) this.throwInvalidSession();

    try {
      // verify token
      const decode = verify(jwt, process.env.JWT_SECRET_TOKEN);
      if (!decode) this.throwInvalidSession();
      const [_, data] = jwt.split('.');
      if (!data) this.throwSessionExpired();
      const parsed = this.parsedVal(data);
      if (parsed) {
        request.userData = parsed;
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      this.throwSessionExpired();
    }
  }
}
