import request from "supertest";

import { PostResponse } from "../../src/post/models/responses/post.response";
import { PostCommentsResponse } from "../../src/post/models/responses/post-comments.reponse";
import { CommentResponse } from "../../src/comment/models/responses/comment.response";

export default class Requests {
  private readonly httpServer;

  constructor(httpServer) {
    this.httpServer = httpServer;
  }

  async createPost(title: string, blog?: string, statusCode = 201): Promise<PostResponse> {
    const response = await request(this.httpServer)
      .post("/v0/posts")
      .send({ title, blog })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(statusCode);

    return response.body;
  }

  async updatePost(id: number, title?: string, blog?: string, statusCode = 200): Promise<PostResponse> {
    const response = await request(this.httpServer)
      .put(`/v0/posts/${id}`)
      .send({ title, blog })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(statusCode);

    return response.body;
  }

  async getAllPosts(statusCode = 200): Promise<PostResponse[]> {
    const response = await request(this.httpServer).get("/v0/posts").expect(statusCode);
    return response.body;
  }

  async getPost(id: number, statusCode = 200): Promise<PostResponse> {
    const response = await request(this.httpServer).get(`/v0/posts/${id}`).expect(statusCode);
    return response.body;
  }

  async getPostWithComments(id: number, statusCode = 200): Promise<PostCommentsResponse> {
    const response = await request(this.httpServer).get(`/v0/posts/${id}/comments`).expect(statusCode);
    return response.body;
  }

  async deletePost(id: number, statusCode = 204): Promise<void> {
    await request(this.httpServer).delete(`/v0/posts/${id}`).expect(statusCode);
  }

  async createComment(postId: number, text: string, name?: string, statusCode = 201): Promise<CommentResponse> {
    const response = await request(this.httpServer)
      .post("/v0/comments")
      .send({ text, name, postId })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(statusCode);

    return response.body;
  }

  async updateComment(id: number, text?: string, name?: string, statusCode = 200): Promise<CommentResponse> {
    const response = await request(this.httpServer)
      .put(`/v0/comments/${id}`)
      .send({ text, name })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(statusCode);

    return response.body;
  }

  async getComment(id: number, statusCode = 200): Promise<CommentResponse> {
    const response = await request(this.httpServer).get(`/v0/comments/${id}`).expect(statusCode);
    return response.body;
  }

  async deleteComment(id: number, statusCode = 204): Promise<void> {
    await request(this.httpServer).delete(`/v0/comments/${id}`).expect(statusCode);
  }
}
