import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassesService } from './passes.service';
import { PassesController } from './passes.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  providers: [PassesService],
  controllers: [PassesController]
})
export class PassesModule {}
