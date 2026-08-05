import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const apiPrefix = configService.get<string>('apiPrefix')!;
  const port = configService.get<number>('port')!;
  const corsOrigin = configService.get<string>('corsOrigin')!;

  app.use(helmet());
  app.enableCors({ origin: corsOrigin === '*' ? true : corsOrigin.split(','), credentials: true });
  app.setGlobalPrefix(apiPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Restaurant Management System API')
    .setDescription(
      'REST API for QR-based ordering, order management, branch management, employee management, and menu management.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addTag('Auth', 'Guest, employee, and admin authentication')
    .addTag('Restaurant', 'Restaurant profile management')
    .addTag('Branch', 'Branch management')
    .addTag('Employee', 'Employee management')
    .addTag('Menu Category', 'Menu category management')
    .addTag('Menu', 'Menu item management')
    .addTag('Table', 'Table & QR code management')
    .addTag('Order', 'QR-based order placement and tracking')
    .addTag('Payment', 'Billing information (no payment gateway)')
    .addTag('Dashboard', 'Admin and employee dashboards')
    .addTag('Health', 'Service health check')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger docs available at: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
