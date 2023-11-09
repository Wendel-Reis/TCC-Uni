import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {  IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';
import { CreateLojaDto } from './create-loja.dto';

export class UpdateLojaDto extends PartialType(CreateLojaDto) {

    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    id: string;

    @ApiPropertyOptional({ description: "O ID do dendereço da loja" })
    @IsUUID()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    endereco_id: string;

}
