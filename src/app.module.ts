import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL!),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    CategoryModule,
  ],
})
export class AppModule {}
