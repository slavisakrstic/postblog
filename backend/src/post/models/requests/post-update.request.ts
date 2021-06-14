import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PostUpdateRequest {
  @IsString()
  @ApiProperty({ required: false })
  title?: string;

  @IsString()
  @ApiProperty({ required: false })
  blog?: string;
}
