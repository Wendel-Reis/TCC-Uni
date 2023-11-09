import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";

export class PatchProdutoImagemPrincipalDto {
    
    @ApiProperty({ description: "ID da imagem anexado préviamente", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    imagem_id?: string;

}