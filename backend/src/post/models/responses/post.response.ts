import { ApiProperty } from "@nestjs/swagger";

export class PostResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  blog: string;

  @ApiProperty()
  numberOfComments: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
