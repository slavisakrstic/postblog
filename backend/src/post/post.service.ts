import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { UpdateResult } from "typeorm";
import { Post } from "./entities/post.entity";
import { PostCreateRequest } from "./models/requests/post-create.request";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async getById(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async getAll(): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        deletedAt: null,
      },
      order: {
        updatedAt: "DESC",
      },
    });
  }

  async getWithCommentsById(id: number): Promise<Post> {
    return this.postRepository.findOne({
      where: {
        id,
        deletedAt: null,
      },
      relations: ["comments"],
    });
  }

  async getAllWithComments(): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        deletedAt: null,
      },
      relations: ["comments"],
    });
  }

  async create(postCreateRequest: PostCreateRequest): Promise<Post> {
    return this.postRepository.save(postCreateRequest);
  }

  async update(id: number, postUpdateRequest): Promise<UpdateResult> {
    return this.postRepository.update(
      { id, deletedAt: null },
      { ...postUpdateRequest, updatedAt: new Date(Date.now()) }
    );
  }

  async incrementNumberOfComments(id: number): Promise<UpdateResult> {
    return this.postRepository.increment({ id }, "numberOfComments", 1);
  }

  async decrementNumberOfComments(id: number): Promise<UpdateResult> {
    return this.postRepository.decrement({ id }, "numberOfComments", 1);
  }

  async delete(id: number): Promise<UpdateResult> {
    return this.postRepository.softDelete({ id, deletedAt: null });
  }
}
