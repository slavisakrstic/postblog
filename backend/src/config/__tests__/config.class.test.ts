import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { Comment } from "../../comment/entities/comment.entity";
import { Post } from "../../post/entities/post.entity";
import { ConfigService, EnvConfig } from "../config.class";
import { ConfigurationError } from "../config.error";

describe("ConfigService", (): void => {
  const originalProcessEnv: EnvConfig = process.env;
  const mockedUnvalidProcessEnv: EnvConfig = {
    PORT: "3010",
    NODE_ENV: "development",
    POSTGRES_PORT: "5432",
    POSTGRES_DB: "txservices_postblog",
    POSTGRES_USER: "txservices",
    POSTGRES_PASSWORD: "txservices",
  };
  const mockedValidProcessEnv: EnvConfig = {
    ...mockedUnvalidProcessEnv,
    POSTGRES_HOST: "localhost",
  };

  const buildTestingModule = (processEnv: EnvConfig = mockedValidProcessEnv): ConfigService => {
    process.env = processEnv;
    return new ConfigService();
  };

  afterAll((): void => {
    process.env = originalProcessEnv;
  });

  describe("initialization", (): void => {
    it("with good configuration, it should be defined", (): void => {
      const service: ConfigService = buildTestingModule();
      expect(service).toBeDefined();
    });

    it("with bad configuration, it should not be defined", (): void => {
      let error;
      const expectedError = new ConfigurationError(
        `Error in the validation of the configuration: ValidationError: "POSTGRES_HOST" is required`
      );
      try {
        buildTestingModule(mockedUnvalidProcessEnv);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual(expectedError);
    });
  });

  test("getOrmModuleOptions", (): void => {
    const service: ConfigService = buildTestingModule();
    const result: ConnectionOptions = service.getOrmModuleOptions();
    expect(result).toEqual({
      type: "postgres",
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      migrationsRun: true,
      entities: [Post, Comment],
      namingStrategy: new SnakeNamingStrategy(),
      cli: {
        migrationsDir: "./src/migrations",
      },
      migrations: ["dist/migrations/*.js"],
      logging: ["error"],
      uuidExtension: "uuid-ossp",
      extra: {
        keepAliveInitialDelayMillis: 1000,
        idleTimeoutMillis: 300000,
        max: 10,
      },
    });
  });

  test("get", (): void => {
    const service: ConfigService = buildTestingModule();
    const result: string = service.get("POSTGRES_HOST");
    expect(result).toEqual("localhost");
  });
});
