import { Module, Logger, OnApplicationShutdown } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentModule } from "./comment/comment.module";
import { PostModule } from "./post/post.module";
import { configService } from "./config/config.service";

@Module({
  imports: [TypeOrmModule.forRoot(configService.getOrmModuleOptions()), CommentModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);

  public onApplicationShutdown(signal: string): void {
    const port = parseInt(configService.get("PORT"), 10);
    this.logger.log("TX Backend", `TX Backend has shut down on port ${port} with signal ${signal}`);
  }
}
