import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReqresService } from './reqres.service';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [ReqresService],
  exports: [ReqresService],
})
export class ReqresModule {}