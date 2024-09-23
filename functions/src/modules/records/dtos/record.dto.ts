import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class RecordInputDto {
  @Expose()
  @IsNotEmpty({ message: "name is required." })
  @IsString()
  name!: string;
}
