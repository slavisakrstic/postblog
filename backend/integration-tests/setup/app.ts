import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import PostgresContainer from "./postgres-container";

export default class App {
  private app: INestApplication;
  private database: PostgresContainer;

  constructor() {
    this.database = new PostgresContainer();
  }

  getApp() {
    return this.app;
  }

  async start(): Promise<void> {
    await this.database.create();
    await this.database.start();

    process.env.PORT = "3030";
    process.env.POSTGRES_HOST = "localhost";
    process.env.POSTGRES_PORT = "5433";
    process.env.POSTGRES_DB = "test";
    process.env.POSTGRES_USER = "test";
    process.env.POSTGRES_PASSWORD = "test";

    const appmod = await import("../../src/app.module");
    const testingApp = Test.createTestingModule({
      imports: [appmod.AppModule],
    });

    const moduleFixture = await testingApp.compile();

    this.app = moduleFixture.createNestApplication();
    this.app.setGlobalPrefix("v0");
    await this.app.init();
  }

  async stopApp(): Promise<void> {
    await this.app.close();
    await this.database.stop();
    await this.database.delete();
  }
}
