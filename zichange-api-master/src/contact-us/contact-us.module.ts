import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactUsEntity } from './entity/contact-us.entity';
import { ContactUsRepository } from './repository/contact-us.repository';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactUsEntity,
      ContactUsRepository,
    ]),
  ],

  controllers: [
    ContactUsController,
  ],

  providers: [
    ContactUsService,
  ],
})
export class ContactUsModule { }