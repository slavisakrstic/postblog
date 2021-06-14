import { Docker } from "node-docker-api";

export default class PostgresContainer {
  private docker = new Docker(undefined);
  private container: any;

  async create(pgPassword = "test", pgUser = "test", pgDb = "test") {
    this.container = await this.docker.container.create({
      Image: "postgres:11.4",
      name: "intTestPg",
      HostConfig: {
        PortBindings: {
          "5432/tcp": [
            {
              HostPort: "5433",
            },
          ],
        },
        NetworkMode: "bridge",
      },
      ExposedPorts: { "5432/tcp": {} },
      Env: [`POSTGRES_PASSWORD=${pgPassword}`, `POSTGRES_USER=${pgUser}`, `POSTGRES_DB=${pgDb}`],
    });
  }

  async start() {
    await this.container.start();
  }

  async stop() {
    await this.container.stop();
  }

  async delete() {
    await this.container.delete({ force: true });
  }
}
