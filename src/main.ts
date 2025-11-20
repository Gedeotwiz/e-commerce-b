import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { createDefaultAdmin } from './__share__/utils/defaul-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: ['http://localhost:3000','https://e-commerce-rho-rust-82.vercel.app/'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const config = new DocumentBuilder()
      .setTitle('E-commerce API')
      .setDescription(
        'E-commerce application API built with NestJS and MongoDB',
      )
      .setVersion('1.0')
      .addTag('Auth')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api-docs', app, document, {
      customSiteTitle: 'E-Commerce API Documentation',
    });

    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);

    await createDefaultAdmin();

    console.log(' MongoDB connection established successfully');
    console.log(
      `🚀 Swagger docs available at http://localhost:${PORT}/api-docs`,
    );
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

bootstrap();
