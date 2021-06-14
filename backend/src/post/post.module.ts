import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "./entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { CommentModule } from "../comment/comment.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef((): CommentModule => CommentModule)],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
