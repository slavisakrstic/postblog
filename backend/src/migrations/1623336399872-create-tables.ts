import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1623336399872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "post" (
        "id" SERIAL NOT NULL, 
        "title" character varying NOT NULL,
        "blog" character varying NOT NULL,
        "number_of_comments" integer NOT NULL DEFAULT 0, 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "post_id_pk" PRIMARY KEY ("id")
      )`
    );

    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "comment" (
        "id" SERIAL NOT NULL, 
        "text" character varying NOT NULL,
        "name" character varying NULL,
        "post_id" integer NOT NULL, 
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "comment_id_pk" PRIMARY KEY ("id"),
        CONSTRAINT "comment_post_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT IF EXISTS "comment_post_fk"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "comment"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "post"`);
  }
}
