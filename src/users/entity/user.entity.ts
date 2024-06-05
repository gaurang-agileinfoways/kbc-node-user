import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 60, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 15, default: null })
  phoneNumber: string;

  @Column('tinyint', { default: true })
  isActive: boolean;
}
