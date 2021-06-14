import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsOptional } from "class-validator";
import { Post } from "../../post/entities/post.entity";

@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn()
  public id?: number;

  @IsOptional()
  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: false })
  text: string;

  @ManyToOne((): typeof Post => Post, (post) => post.comments)
  post?: Post;

  @Column({ nullable: false })
  public postId: number;

  @CreateDateColumn({ type: "timestamptz", default: new Date() })
  public createdAt?: Date;

  @UpdateDateColumn({ type: "timestamptz", default: new Date() })
  public updatedAt?: Date;

  @IsOptional()
  @DeleteDateColumn({ type: "timestamp", default: null })
  deletedAt?: Date;
}
