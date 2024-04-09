import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModel } from 'src/models/cities.model';
import { AdminsModule } from 'src/governance/admins/admins.module';

@Module({
  providers: [CitiesService],
  controllers: [CitiesController],
  imports: [
    TypeOrmModule.forFeature([
      CityModel,
    ]),
    AdminsModule,
  ],
  exports: [
    CitiesService,
  ],
})
export class CitiesModule {}
