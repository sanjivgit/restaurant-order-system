import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, errors } = this.parseException(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(`${request.method} ${request.originalUrl} - ${message}`, (exception as Error)?.stack);
    } else {
      this.logger.warn(`${request.method} ${request.originalUrl} - ${message}`);
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }

  private parseException(exception: unknown): { message: string; errors: unknown[] } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return { message: response, errors: [] };
      }

      if (typeof response === 'object') {
        const body = response as Record<string, unknown>;
        const message = (body.message as string) ?? exception.message;
        const errors = Array.isArray(body.errors) ? (body.errors as unknown[]) : [];
        return { message: Array.isArray(message) ? message.join(', ') : message, errors };
      }
    }

    return { message: 'Internal server error.', errors: [] };
  }
}
