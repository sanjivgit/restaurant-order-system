import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validates the incoming value against the provided Zod schema.
 * Usage: @Body(new ZodValidationPipe(createOrderSchema)) body: CreateOrderDto
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const errors = this.formatErrors(result.error);
      throw new BadRequestException({
        success: false,
        message: 'Validation failed.',
        errors,
      });
    }

    return result.data;
  }

  private formatErrors(error: ZodError) {
    return error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }
}
