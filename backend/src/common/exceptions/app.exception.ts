import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Thin wrapper around HttpException so business-logic errors thrown from
 * services carry a consistent shape that the HttpExceptionFilter understands.
 */
export class AppException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST, errors: unknown[] = []) {
    super({ message, errors }, status);
  }
}

export class NotFoundException extends AppException {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} with id "${id}" not found.` : `${entity} not found.`, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class ForbiddenActionException extends AppException {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class InvalidCredentialsException extends AppException {
  constructor(message = 'Invalid email or password.') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidOrderStatusTransitionException extends AppException {
  constructor(from: string, to: string) {
    super(`Cannot transition order from "${from}" to "${to}".`, HttpStatus.BAD_REQUEST);
  }
}
