import { Global, Module } from '@nestjs/common';
import { UserReadModule } from '../user-read';

@Global()
@Module({
  imports: [UserReadModule],
  exports: [UserReadModule],
})
export class GlobalModule {}
