import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TutorEntity } from './tutor.entity';

@Entity({ name: 'pets' })
export class PetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  species: string;

  @Column({ type: 'varchar' })
  breed: string;

  @Column({ type: 'int' })
  age: number;

  @ManyToOne(() => TutorEntity, (tutor) => tutor.pets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutor_id' })
  @Column({ type: 'varchar', name: 'tutor_id', foreignKeyConstraintName: 'id' })
  tutorId: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
