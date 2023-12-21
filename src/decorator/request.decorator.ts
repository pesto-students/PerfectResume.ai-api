import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const UserData = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const userData = ctx.switchToHttp().getRequest().userData;
    if (!userData) {
      throw new InternalServerErrorException(
        'No UserData found for this Controller',
      );
    }
    if (key) return userData[key];
    return userData;
  },
);
