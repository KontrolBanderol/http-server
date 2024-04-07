import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionsModule } from 'src/sessions/sessions.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => SessionsModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('PRIVATE_KEY', { infer: true }),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    TokensModule,
  ]
})
export class AuthModule {}
