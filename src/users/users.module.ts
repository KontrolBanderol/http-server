import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModel } from 'src/models/email.model';
import { MetaModel } from 'src/models/meta.model';
import { UserModel } from 'src/models/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { ProducerModule } from './producer/producer.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      EmailModel,
      MetaModel,
      UserModel,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => ProducerModule),
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
