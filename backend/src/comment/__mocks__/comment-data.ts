import { Comment } from "../entities/comment.entity";
import { CommentCreateRequest } from "../models/requests/comment-create.request";
import { PostCreateRequest } from "../../post/models/requests/post-create.request";
import { Post } from "../../post/entities/post.entity";
import { CommentResponse } from "../models/responses/comment.response";
import { CommentUpdateRequest } from "../models/requests/comment-update.request";

export const testDateNow = 1623372689965;

export const testCreatedRequestComment: CommentCreateRequest = {
  postId: 1,
  text: "Comment 1",
  name: "Slavisa",
};

export const testUpdatedRequestComment: CommentUpdateRequest = {
  text: "Comment 1",
  name: "Slavisa",
};

export const testCreatedDbResponseComment: Comment = {
  id: 1,
  postId: 1,
  text: "Comment 1",
  name: "Slavisa",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
  deletedAt: null,
};

export const testCreatedResponseComment: CommentResponse = {
  id: 1,
  postId: 1,
  text: "Comment 1",
  name: "Slavisa",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
};

export const testCreatedRequestPost: PostCreateRequest = {
  title: "Title 1",
  blog: "Blog 1",
};

export const testCreatedDbResponsePost: Post = {
  id: 1,
  numberOfComments: 0,
  title: "Title 1",
  blog: "Blog 1",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
  deletedAt: null,
};
