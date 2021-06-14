import { Post } from "../entities/post.entity";
import { PostResponse } from "../models/responses/post.response";

export const toPostResponseMapper = (post: Post): PostResponse => {
  const response = new PostResponse();
  response.id = post.id;
  response.title = post.title;
  response.blog = post.blog;
  response.numberOfComments = post.numberOfComments;
  response.createdAt = post.createdAt;
  response.updatedAt = post.updatedAt;
  return response;
};
