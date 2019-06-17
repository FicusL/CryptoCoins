import { EntityRepository } from 'typeorm';
import { Repository } from 'typeorm';
import { ContactUsEntity } from '../entity/contact-us.entity';

@EntityRepository(ContactUsEntity)
export class ContactUsRepository extends Repository<ContactUsEntity> {

}