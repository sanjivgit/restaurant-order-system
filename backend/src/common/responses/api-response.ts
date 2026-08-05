export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

export class ApiResponse {
  static success<T>(data: T, message = 'Request successful', meta?: Record<string, unknown>): ApiSuccessResponse<T> {
    return { success: true, message, data, ...(meta ? { meta } : {}) };
  }

  static error(message: string, errors: unknown[] = []): ApiErrorResponse {
    return { success: false, message, errors };
  }
}
