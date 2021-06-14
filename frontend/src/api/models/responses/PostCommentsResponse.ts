import { CommentResponse } from "./CommentResponse";

export interface PostCommentsResponse {
  id: number;
  title: string;
  blog: string;
  numberOfComments: number;
  comments: CommentResponse[];
  createdAt: Date;
  updatedAt: Date;
}
