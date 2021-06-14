import { Post } from "../entities/post.entity";
import { PostCommentsResponse } from "../models/responses/post-comments.reponse";
import { toCommentResponseMapper } from "../../comment/mappers/comment.response.mapper";

export const toPostCommentsResponseMapper = (post: Post): PostCommentsResponse => {
  const response = new PostCommentsResponse();
  response.id = post.id;
  response.title = post.title;
  response.blog = post.blog;
  response.comments = post.comments.map((comment) => toCommentResponseMapper(comment));
  response.numberOfComments = post.numberOfComments;
  response.createdAt = post.createdAt;
  response.updatedAt = post.updatedAt;

  return response;
};
