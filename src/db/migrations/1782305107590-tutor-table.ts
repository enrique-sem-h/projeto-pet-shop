import { MigrationInterface, QueryRunner } from 'typeorm';

export class TutorTable1782305107590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
        CREATE TABLE tutors (
            id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name varchar(100) NOT NULL,
            email varchar(100) NOT NULL,
            age int NOT NULL,
            created_at timestamp DEFAULT NOW(),
            CONSTRAINT user_un_email UNIQUE (email)
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS tutors CASCADE;');
  }
}
