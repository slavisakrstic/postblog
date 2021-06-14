import { configService } from "./config/config.service";

module.exports = {
  ...configService.getOrmModuleOptions(),
  migrations: ["src/migrations/*.ts"],
};
