import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PostCreateRequest {
  @IsString()
  @ApiProperty({ required: true })
  title: string;

  @IsString()
  @ApiProperty({ required: true })
  blog: string;
}
