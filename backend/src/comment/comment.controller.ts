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
import { UpdateResult } from "typeorm";
import { CommentService } from "./comment.service";
import { PostService } from "../post/post.service";
import { CommentCreateRequest } from "./models/requests/comment-create.request";
import { CommentUpdateRequest } from "./models/requests/comment-update.request";
import { CommentResponse } from "./models/responses/comment.response";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { toCommentResponseMapper } from "./mappers/comment.response.mapper";

@Controller("comments")
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService, private readonly postService: PostService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Create comment for the post" })
  @ApiResponse({
    status: 201,
    description: "Comment is created for provided post",
    type: CommentResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Comment can not be created for not existing post",
    type: NotFoundException,
  })
  async create(@Body() commentCreateRequest: CommentCreateRequest): Promise<CommentResponse> {
    const post = await this.postService.getById(commentCreateRequest.postId);

    if (!post) {
      this.logger.error(
        { postId: commentCreateRequest.postId },
        null,
        `Post with postId ${commentCreateRequest} not found`
      );
      throw new NotFoundException(`Post with postId ${commentCreateRequest.postId} not found`);
    }

    const comment = await this.commentService.create(commentCreateRequest);

    if (!comment) {
      this.logger.error({ postId: post.id }, null, `Unable to create new Comment with postId ${post.id}`);
      throw new InternalServerErrorException(`Unable to create new Comment with postId ${post.id}`);
    }

    await this.postService.incrementNumberOfComments(commentCreateRequest.postId);
    return toCommentResponseMapper(comment);
  }

  @Put(":commentId")
  @HttpCode(200)
  @ApiOperation({ summary: "Update comment for the post" })
  @ApiResponse({
    status: 200,
    description: "Comment is updated for provided post",
    type: CommentResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Comment can not be updated for not existing post",
    type: NotFoundException,
  })
  async update(
    @Param("commentId") commentId: number,
    @Body() commentUpdateRequest: CommentUpdateRequest
  ): Promise<CommentResponse> {
    const response: UpdateResult = await this.commentService.update(commentId, commentUpdateRequest);

    if (response.affected === 0) {
      this.logger.error({ commentId }, null, `Comment with commentId ${commentId} not found`);
      throw new NotFoundException(`Comment with commentId ${commentId} not found`);
    }

    const comment = await this.commentService.getById(commentId);
    return toCommentResponseMapper(comment);
  }

  @Get(":commentId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get comment" })
  @ApiResponse({
    status: 200,
    description: "Get comment",
    type: CommentResponse,
  })
  @ApiResponse({
    status: 404,
    description: "Comment doesn't exist for provided commentId",
    type: NotFoundException,
  })
  async get(@Param("commentId") commentId: number): Promise<CommentResponse> {
    const comment = await this.commentService.getById(commentId);

    if (!comment) {
      this.logger.error({ commentId }, null, `Comment with commentId ${commentId} not found`);
      throw new NotFoundException(`Comment with commentId ${commentId} not found`);
    }

    return toCommentResponseMapper(comment);
  }

  @Delete(":commentId")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 204,
    description: "Comment deleted",
  })
  @ApiResponse({
    status: 404,
    description: "Comment doesn't exist. Comment can't be deleted",
    type: NotFoundException,
  })
  @ApiResponse({
    status: 500,
    description: "Comment is not deleted",
    type: InternalServerErrorException,
  })
  async delete(@Param("commentId") commentId: number): Promise<void> {
    const comment = await this.commentService.getById(commentId);

    if (!comment) {
      this.logger.error({ commentId }, null, `Comment with commentId ${commentId} not found`);
      throw new NotFoundException(`Comment with commentId ${commentId} not found`);
    }

    const response: UpdateResult = await this.commentService.delete(commentId);

    if (response.affected === 0) {
      this.logger.error({ commentId }, null, `Comment with commentId ${commentId} is not deleted`);
      throw new InternalServerErrorException(`Comment with commentId ${commentId} is not deleted`);
    }

    await this.postService.decrementNumberOfComments(comment.postId);
  }
}
