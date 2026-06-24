import { MigrationInterface, QueryRunner } from 'typeorm';

export class PetTable1782305458536 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
        CREATE TABLE pets (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name varchar(100) NOT NULL,
            species varchar(100) NOT NULL,
            breed varchar(100) NOT NULL,
            age int NOT NULL,
            tutor_id uuid NOT NULL,
            created_at timestamp DEFAULT NOW(),
            CONSTRAINT fk_tutor_id foreign key (tutor_id) REFERENCES tutors (id)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pets', true, true);
  }
}
