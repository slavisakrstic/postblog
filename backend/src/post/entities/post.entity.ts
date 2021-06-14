import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsOptional } from "class-validator";
import { Comment } from "../../comment/entities/comment.entity";

@Entity("post")
export class Post {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  blog: string;

  @OneToMany((): typeof Comment => Comment, (comment) => comment.post)
  comments?: Comment[];

  @Column({ nullable: false, default: 0 })
  numberOfComments: number;

  @CreateDateColumn({ type: "timestamptz", default: new Date() })
  public createdAt?: Date;

  @UpdateDateColumn({ type: "timestamptz", default: new Date() })
  public updatedAt?: Date;

  @IsOptional()
  @DeleteDateColumn({ type: "timestamp", default: null })
  deletedAt?: Date;
}
