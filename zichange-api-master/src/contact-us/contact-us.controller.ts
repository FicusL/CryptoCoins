import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { InContactUsDTO } from './dto/in.contact-us.dto';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  constructor(
    protected readonly contactUsService: ContactUsService,
  ) {}

  @Post()
  async create(@Body() dto: InContactUsDTO) {
    await this.contactUsService.create(dto);
  }
}