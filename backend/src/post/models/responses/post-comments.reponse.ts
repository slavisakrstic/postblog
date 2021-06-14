import { ApiProperty } from "@nestjs/swagger";
import { CommentResponse } from "../../../comment/models/responses/comment.response";

export class PostCommentsResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  blog: string;

  @ApiProperty()
  numberOfComments: number;

  @ApiProperty({ type: () => [CommentResponse] })
  comments: CommentResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
