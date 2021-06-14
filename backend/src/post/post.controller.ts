import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Logger,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { UpdateResult } from "typeorm";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PostResponse } from "./models/responses/post.response";
import { PostCreateRequest } from "./models/requests/post-create.request";
import { toPostResponseMapper } from "./mappers/post.response.mapper";
import { PostUpdateRequest } from "./models/requests/post-update.request";
import { toPostCommentsResponseMapper } from "./mappers/post-comments.response.mapper";
import { CommentService } from "../comment/comment.service";
import { PostCommentsResponse } from "./models/responses/post-comments.reponse";

@Controller("posts")
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(private readonly postService: PostService, private readonly commemntService: CommentService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Create post" })
  @ApiResponse({
    status: 201,
    description: "Post is created",
    type: PostResponse,
  })
  async create(@Body() postCreateRequest: PostCreateRequest): Promise<PostResponse> {
    const post = await this.postService.create(postCreateRequest);
    this.logger.log(post, "Post successfully has been created");
    return toPostResponseMapper(post);
  }

  @Put(":postId")
  @HttpCode(200)
  @ApiOperation({ summary: "Update post" })
  @ApiResponse({
    status: 200,
    description: "Post is updated",
    type: PostResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Post doesn't exist for provided postId",
    type: NotFoundException,
  })
  async update(@Param("postId") postId: number, @Body() postUpdateRequest: PostUpdateRequest): Promise<PostResponse> {
    const response: UpdateResult = await this.postService.update(postId, postUpdateRequest);

    if (response.affected === 0) {
      this.logger.error({ postId }, null, `Post with postId ${postId} not found`);
      throw new NotFoundException(`Post with postId ${postId} not found`);
    }

    const post = await this.postService.getById(postId);
    this.logger.log(post, "Post successfully has been updated");
    return toPostResponseMapper(post);
  }

  @Get(":postId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get post" })
  @ApiResponse({
    status: 200,
    description: "Get post",
    type: PostResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Post doesn't exist for provided postId",
    type: NotFoundException,
  })
  async get(@Param("postId") postId: number): Promise<PostResponse> {
    const post = await this.postService.getById(postId);

    if (!post) {
      this.logger.error({ postId }, null, `Post with postId ${postId} not found`);
      throw new NotFoundException(`Post with postId ${postId} not found`);
    }

    return toPostResponseMapper(post);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: "Get all posts" })
  @ApiResponse({
    status: 200,
    description: "Get all posts",
    type: PostResponse,
  })
  async getAll(): Promise<PostResponse[]> {
    const posts = await this.postService.getAll();
    return posts.map((post) => toPostResponseMapper(post));
  }

  @Get(":postId/comments")
  @HttpCode(200)
  @ApiOperation({ summary: "Get post with comments" })
  @ApiResponse({
    status: 200,
    description: "Get post with comments",
    type: PostCommentsResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Post doesn't exist for provided postId",
    type: NotFoundException,
  })
  async getWithCommentsById(@Param("postId") postId: number): Promise<PostCommentsResponse> {
    const post = await this.postService.getWithCommentsById(postId);

    if (!post) {
      this.logger.error({ postId }, null, `Post with postId ${postId} not found`);
      throw new NotFoundException(`Post with postId ${postId} not found`);
    }

    return toPostCommentsResponseMapper(post);
  }

  @Delete(":postId")
  @HttpCode(204)
  @ApiOperation({ summary: "Post comment" })
  @ApiResponse({
    status: 204,
    description: "Post deleted",
  })
  @ApiResponse({
    status: 404,
    description: "Post doesn't exist. Post can't be deleted",
    type: NotFoundException,
  })
  @ApiResponse({
    status: 500,
    description: "Post is not deleted",
    type: InternalServerErrorException,
  })
  @ApiResponse({
    status: 500,
    description: "Comments are not deleted",
    type: InternalServerErrorException,
  })
  async delete(@Param("postId") postId: number): Promise<void> {
    const post = await this.postService.getById(postId);

    if (!post) {
      this.logger.error({ postId }, null, `Post with postId ${postId} not found`);
      throw new NotFoundException(`Post with postId ${postId} not found`);
    }

    const responsePost: UpdateResult = await this.postService.delete(postId);

    if (responsePost.affected === 0) {
      this.logger.error({ postId }, null, `Post with postId ${postId} is not deleted`);
      throw new InternalServerErrorException(`Post with postId ${postId} is not deleted`);
    }

    if (post.numberOfComments) {
      const responseComments: UpdateResult = await this.commemntService.deleteByPostId(postId);

      if (responseComments.affected === 0) {
        this.logger.error({ postId }, null, `Comments with postId ${postId} are not deleted`);
        throw new InternalServerErrorException(`Comments with postId ${postId} are not deleted`);
      }
    }
  }
}
