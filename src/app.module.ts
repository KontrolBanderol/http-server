import { Module } from '@nestjs/common';
import { EnvFilePathModule } from './providers/envfilepath.module';

@Module({
  imports: [
    EnvFilePathModule,
  ],
})
export class AppModule {}
