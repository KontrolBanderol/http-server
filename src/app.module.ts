import { Module } from '@nestjs/common';
import { EnvFilePathModule } from './providers/envfilepath.module';
import { PostgresModule } from './providers/postgres.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { SessionsModule } from './sessions/sessions.module';
import { DIYMailerModule } from './providers/mailer.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    EnvFilePathModule,
    PostgresModule,
    MailerModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    DIYMailerModule,
    TokensModule,
  ],
})
export class AppModule {}
