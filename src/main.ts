import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { createDefaultAdmin } from './utils/defaul-admin';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);

    const config = new DocumentBuilder()
      .setTitle('E-Commerce API')
      .setDescription('API documentation for E-Commerce application')
      .setVersion('1.0')
      .addBearerAuth() 
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); 
    
    await createDefaultAdmin();
    console.log('MongoDB connection established successfully');
    console.log(`Swagger documentation available on http://localhost:${PORT}/api`);
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
}

bootstrap();
