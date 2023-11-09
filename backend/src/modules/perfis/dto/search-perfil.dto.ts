import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";

export class SearchPerfilDto {

    @ApiPropertyOptional({ description: "Indica se deve trazer ou não o perfil 'CLIENTE'", default: true, example: true })
    @IsOptional()
    with_cliente?: string;

}