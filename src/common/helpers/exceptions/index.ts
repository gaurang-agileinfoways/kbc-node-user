import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export * from './auth.exception';
export * from './type.exception';
export * from './connection.exception';

export const CustomError = {
  UnknownError(message): any {
    return new RpcException({
      message: message || 'Something went wrong, please try again later!',
      error: 'UnknownError',
      statusCode: HttpStatus.BAD_GATEWAY,
    });
  },
};
