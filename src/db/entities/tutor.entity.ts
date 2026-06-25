import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PetEntity } from './pet.entity';

@Entity({ name: 'tutors' })
export class TutorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @OneToMany(() => PetEntity, (pet) => pet.tutorId)
  pets: PetEntity[];
}
