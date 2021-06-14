export interface CommentResponse {
  id: number;
  text: string;
  name?: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}