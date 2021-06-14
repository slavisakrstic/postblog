import { ConnectionOptions, createConnection } from "typeorm";
import { configService } from "./config/config.service";

(async (): Promise<void> => {
  async function migrate(options: ConnectionOptions): Promise<void> {
    try {
      const connection = await createConnection({
        ...options,
      });
      process.env.APP_MIGRATION_REVERT === "yes"
        ? await connection.undoLastMigration()
        : await connection.runMigrations();

      await connection.close();
    } catch (e) {
      process.exit(1);
    }
  }

  await migrate(configService.getOrmModuleOptions());
})();
