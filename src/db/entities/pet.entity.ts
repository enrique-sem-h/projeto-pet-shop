import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'varchar', name: 'tutor_id', foreignKeyConstraintName: 'id' })
  tutorId: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}
