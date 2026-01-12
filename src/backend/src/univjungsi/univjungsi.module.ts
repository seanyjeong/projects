import { Module, Global } from '@nestjs/common';
import { UnivjungsiService } from './univjungsi.service';

@Global()
@Module({
  providers: [UnivjungsiService],
  exports: [UnivjungsiService],
})
export class UnivjungsiModule {}
