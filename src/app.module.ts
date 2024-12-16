import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassesModule } from './passes/passes.module';

@Module({
  imports: [PassesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
