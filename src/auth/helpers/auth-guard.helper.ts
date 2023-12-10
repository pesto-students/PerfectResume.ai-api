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

  private throwMissing() {
    throw new UnauthorizedException('Exected a JWT Token');
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
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    if (!headers.authorization) this.throwBasicAuth();

    const [type, jwt] = headers.authorization.split(' ');
    if (type !== 'Bearer' || !jwt) this.throwBasicAuth();

    // verify token
    const decode = verify(jwt, process.env.JWT_SECRET_TOKEN);
    if (!decode) throw new UnauthorizedException('Invalid Token');
    const [_, data] = jwt.split('.');
    if (!data) this.throwMissing();

    const parsed = this.parsedVal(data);
    try {
      if (parsed) {
        request.userData = parsed;
        return true;
      } else {
        throw new Error();
      }
    } catch (err) {
      this.throwBasicAuth();
    }
  }
}
