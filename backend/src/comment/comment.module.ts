import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentController } from "./comment.controller";
import { Comment } from "./entities/comment.entity";
import { CommentService } from "./comment.service";
import { PostModule } from "../post/post.module";

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), forwardRef((): PostModule => PostModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
