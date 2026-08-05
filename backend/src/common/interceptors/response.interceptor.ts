import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '@common/responses/api-response';

/**
 * Wraps every controller return value in the standard
 * { success, message, data } envelope, unless the handler
 * has already returned that shape itself (e.g. custom meta).
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'success' in payload) {
          return payload as ApiSuccessResponse<T>;
        }

        const { message, data } = this.extractMessageAndData(payload);
        return { success: true, message, data };
      }),
    );
  }

  private extractMessageAndData(payload: any): { message: string; data: T } {
    if (payload && typeof payload === 'object' && 'message' in payload && 'data' in payload) {
      return { message: payload.message, data: payload.data };
    }
    return { message: 'Request successful.', data: payload };
  }
}
