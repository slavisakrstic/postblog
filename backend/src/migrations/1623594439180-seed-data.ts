import { MigrationInterface, QueryRunner } from "typeorm";

export class seedData1623594439180 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "post" (
        "title", "blog", "number_of_comments")
        VALUES (
          'What is Lorem Ipsum?', 
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 
          1
        )
      `
    );

    await queryRunner.query(
      `INSERT INTO "comment" (
        "post_id", "name", "text")
        VALUES (
          1, 
          'Slavisa Krstic', 
          'Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.'
        )
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "post"
        WHERE "id" = 1
      `
    );

    await queryRunner.query(
      `DELETE FROM "comment"
        WHERE "id" = 1
      `
    );
  }
}
