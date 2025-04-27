import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/jwt/jwt-auth.guard';
import { AppModule } from '@app/app.module';

export class WithoutUnusedLogger extends ConsoleLogger {
  log(message: string, context?: string) {
    if (
      context === 'RoutesResolver' ||
      context === 'RouterExplorer' ||
      context === 'InstanceLoader'
    ) {
      return; // Ignore these logs
    }
    super.log(message, context); // Keep other logs
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WithoutUnusedLogger(),
  });

  // Global Guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  //

  // Global prefix
  app.setGlobalPrefix('api');
  //

  // Cookie parser middleware
  app.use(cookieParser());
  //

  // Enable CORS
  app.enableCors({
    origin: [], // Here you can specify the allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  //

  // Enables DTO validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes unknown properties
      forbidNonWhitelisted: true, // Throws error if unknown properties are present
      transform: true, // Transforms payloads into DTO instances
    }),
  );
  //

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nest Starter Kit API')
    .setDescription('Auth and user system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  //

  await app.listen(3000);
}
bootstrap();
