import { PostCreateRequest } from "../models/requests/post-create.request";
import { Post } from "../entities/post.entity";
import { Comment } from "../../comment/entities/comment.entity";
import { CommentCreateRequest } from "../../comment/models/requests/comment-create.request";
import { CommentResponse } from "../../comment/models/responses/comment.response";
import { CommentUpdateRequest } from "../../comment/models/requests/comment-update.request";
import { PostUpdateRequest } from "../models/requests/post-update.request";
import { PostResponse } from "../models/responses/post.response";

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

export const testCreatedDbResponsePostWithComments: Post = {
  id: 1,
  numberOfComments: 1,
  title: "Title 1",
  blog: "Blog 1",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
  deletedAt: null,
  comments: [
    {
      id: 1,
      postId: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
      deletedAt: null,
    },
  ],
};

export const testCreatedResponsePostWithComments: Post = {
  id: 1,
  numberOfComments: 1,
  title: "Title 1",
  blog: "Blog 1",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
  comments: [
    {
      id: 1,
      postId: 1,
      name: "comment",
      text: "text",
      createdAt: new Date(testDateNow),
      updatedAt: new Date(testDateNow),
    },
  ],
};

export const testCreatedResponsePost: PostResponse = {
  id: 1,
  numberOfComments: 0,
  title: "Title 1",
  blog: "Blog 1",
  createdAt: new Date(testDateNow),
  updatedAt: new Date(testDateNow),
};

export const testUpdatedRequestPost: PostUpdateRequest = {
  title: "Title 1",
  blog: "Blog 1",
};
