import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CommentUpdateRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  text?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name?: string;
}
