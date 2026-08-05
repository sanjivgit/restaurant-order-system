import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiResponse } from '@common/responses/api-response';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness/readiness check, including database connectivity.' })
  async check() {
    let database: 'up' | 'down' = 'up';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'down';
    }

    return ApiResponse.success(
      { status: 'ok', database, timestamp: new Date().toISOString() },
      'Service is healthy.',
    );
  }
}
