import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { UserAuthGuard } from './auth/helpers/auth-guard.helper';
import { OpenAIModule } from './openai/openai.module';
import { TemplatesModule } from './templates/templates.module';
import { ResumesModule } from './resumes/resumes.module';
import { UploadModule } from './upload/upload.module';
import { TemplateModule } from './template/template.module';

@Module({
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: UserAuthGuard }],
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://perfectResumeAi:5AKmwxlDo1YSfaOr@testcluster.ctkpnw4.mongodb.net/?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TemplatesModule,
    OpenAIModule,
    ResumesModule,
    UploadModule,
    TemplateModule,
  ],
})
export class AppModule {}
