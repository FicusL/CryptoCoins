import { Module } from '@nestjs/common';
import { CalculationsService } from './service/calculations.service';

@Module({
  imports: [ ], // Must be empty
  providers: [ CalculationsService ],
  exports: [ CalculationsService ],
})
export class CalculationsModule { }