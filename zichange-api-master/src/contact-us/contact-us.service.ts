import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { ContactUsRepository } from './repository/contact-us.repository';
import { ContactUsEntity } from './entity/contact-us.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(ContactUsRepository)
    protected readonly repository: ContactUsRepository,
  ) { }

  async create(data: Partial<ContactUsEntity>): Promise<ContactUsEntity> {
    let entity = new ContactUsEntity(data);

    try {
      entity = await this.repository.save(entity);
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return entity;
  }
}