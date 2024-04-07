import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModel } from 'src/models/email.model';
import { UserModel } from 'src/models/users.model';
import { SessionModel } from 'src/models/sessions.model';
import { MetaModel } from 'src/models/meta.model';
import { TokenModel } from 'src/models/tokens.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.getOrThrow('POSTGRES_HOST'),
          port: Number(configService.getOrThrow('POSTGRES_PORT')),
          username: configService.getOrThrow('POSTGRES_USER'),
          password: configService.getOrThrow('POSTGRES_PASSWORD'),
          database: configService.getOrThrow('POSTGRES_DB'),
          entities: [
            UserModel,
            SessionModel,
            EmailModel,
            MetaModel,
            TokenModel,
          ],
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class PostgresModule {}
