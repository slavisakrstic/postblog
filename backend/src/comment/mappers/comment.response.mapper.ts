import { Comment } from "../entities/comment.entity";
import { CommentResponse } from "../models/responses/comment.response";

export const toCommentResponseMapper = (comment: Comment): CommentResponse => {
  const response = new CommentResponse();
  response.id = comment.id;
  response.postId = comment.postId;
  response.name = comment.name;
  response.text = comment.text;
  response.createdAt = comment.createdAt;
  response.updatedAt = comment.updatedAt;
  return response;
};
