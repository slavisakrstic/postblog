import { ValidationResult } from "@hapi/joi";
import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { Comment } from "../comment/entities/comment.entity";
import { Post } from "../post/entities/post.entity";

import { envVarsSchema } from "./config.schema";
import { ConfigurationError } from "./config.error";

export type EnvConfig = Record<string, string>;

class ConfigService {
  private readonly envConfig: EnvConfig;

  public constructor() {
    this.envConfig = this.validateInput({ ...process.env });
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const validationResult: ValidationResult = envVarsSchema.validate(envConfig, { allowUnknown: true });
    if (validationResult.error) {
      throw new ConfigurationError(`Error in the validation of the configuration: ${validationResult.error}`);
    }
    return validationResult.value;
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getOrmModuleOptions(): ConnectionOptions {
    return {
      type: "postgres",
      port: parseInt(this.get("POSTGRES_PORT"), 10),
      username: this.get("POSTGRES_USER"),
      database: this.get("POSTGRES_DB"),
      password: this.get("POSTGRES_PASSWORD"),
      host: this.get("POSTGRES_HOST"),
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
        keepAliveInitialDelayMillis: parseInt(this.get("POSTGRES_KEEP_ALIVE_DM"), 10) || 1000,
        idleTimeoutMillis: parseInt(this.get("POSTGRES_IDLE_TIMEOUT"), 10) || 300000,
        max: parseInt(this.get("POSTGRES_CONNECTION_POOL_SIZE"), 10) || 10,
      },
    };
  }
}

export { ConfigService };
