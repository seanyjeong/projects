import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import {
  UniversityController,
  DepartmentController,
} from './university.controller';

@Module({
  controllers: [UniversityController, DepartmentController],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
