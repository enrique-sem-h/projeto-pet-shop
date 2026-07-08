import { MigrationInterface, QueryRunner } from "typeorm";

export class TablesSetup1782477106921 implements MigrationInterface {
    name = 'TablesSetup1782477106921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tutors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "age" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_58a80f88037815ba543691220e4" UNIQUE ("email"), CONSTRAINT "PK_bab3e19eb9a7a36a6a95377963b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "species" character varying NOT NULL, "breed" character varying NOT NULL, "age" integer NOT NULL, "tutor_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d01e9e7b4ada753c826720bee8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pets" ADD CONSTRAINT "FK_eb990a74dbc1c946095cba08d38" FOREIGN KEY ("tutor_id") REFERENCES "tutors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pets" DROP CONSTRAINT "FK_eb990a74dbc1c946095cba08d38"`);
        await queryRunner.query(`DROP TABLE "pets"`);
        await queryRunner.query(`DROP TABLE "tutors"`);
    }

}
