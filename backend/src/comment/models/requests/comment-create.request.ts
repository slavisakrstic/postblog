import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CommentCreateRequest {
  @IsString()
  @ApiProperty({ required: true })
  text: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsNumber()
  @ApiProperty({ required: true })
  postId: number;
}
