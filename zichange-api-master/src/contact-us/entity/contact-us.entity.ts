import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';

@Entity({ name: 'contact_us' })
export class ContactUsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  message: string;

  constructor(data?: Partial<ContactUsEntity>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}