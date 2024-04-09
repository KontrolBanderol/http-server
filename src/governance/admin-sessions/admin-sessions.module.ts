import { Module, forwardRef } from '@nestjs/common';
import { AdminSessionsService } from './admin-sessions.service';
import { AdminSessionsController } from './admin-sessions.controller';
import { EnvFilePathModule } from 'src/providers/envfilepath.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSessionModel } from 'src/models/admin-sessions.model';
import { AdminsModule } from '../admins/admins.module';

@Module({
  providers: [AdminSessionsService],
  controllers: [AdminSessionsController],
  imports: [
    forwardRef(() => AdminsModule),
    EnvFilePathModule,
    TypeOrmModule.forFeature([AdminSessionModel]),
    JwtModule.register({
      secret: process.env.ADMIN_PRIVATE_KEY as string,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  exports: [AdminSessionsService],
})
export class AdminSessionsModule {}
