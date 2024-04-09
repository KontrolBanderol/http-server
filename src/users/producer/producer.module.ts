import { Module, forwardRef } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from '../users.module';
import { CitiesModule } from 'src/cities/cities.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModel } from 'src/models/storages.model';
import { ProductModel } from 'src/models/products.model';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  providers: [ProducerService],
  controllers: [ProducerController],
  imports: [
    TypeOrmModule.forFeature([
      StorageModel,
      ProductModel,
    ]),
    AuthModule,
    forwardRef(() => UsersModule),
    CitiesModule,
    CategoriesModule,
  ],
})
export class ProducerModule {}
