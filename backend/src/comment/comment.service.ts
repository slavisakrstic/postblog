import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  async getById(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getAll(postId): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        postId,
        deletedAt: null,
      },
    });
  }

  async create(commentRequest: any): Promise<Comment> {
    return this.commentRepository.save(commentRequest);
  }

  async update(id: number, commentUpdateRequest): Promise<UpdateResult> {
    return this.commentRepository.update(
      { id, deletedAt: null },
      { ...commentUpdateRequest, updatedAt: new Date(Date.now()) }
    );
  }

  async delete(id: number): Promise<UpdateResult> {
    return this.commentRepository.softDelete({ id, deletedAt: null });
  }

  async deleteByPostId(postId: number): Promise<UpdateResult> {
    return this.commentRepository.softDelete({ postId, deletedAt: null });
  }
}
