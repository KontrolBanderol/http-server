import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionModel } from 'src/models/sessions.model';

@Module({
  providers: [SessionsService],
  controllers: [SessionsController],
  imports: [
    TypeOrmModule.forFeature([
      SessionModel,
    ]),
  ],
  exports: [
    SessionsService,
  ]
})
export class SessionsModule {}
