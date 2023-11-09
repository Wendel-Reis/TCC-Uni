import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CargaNome } from '../../../shared/constants/carga-tipos.constant';
import { CargaStatus } from '../../../shared/constants/cargta-status.constant';

export class SearchCargasDto {

    @ApiProperty({ description: "O ID do usuário que fez a carga", example: "48a75f11-e2b7-4f18-a0b7-838f9b187ae0" })
    @IsUUID()
    @IsNotEmpty({ message: 'O campo "user_id" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    user_id: string;

    @ApiPropertyOptional({
        description: "O status da carga", enum: CargaStatus
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsEnum(CargaStatus, { message: `Status de carga inválido` })
    @IsOptional()
    status?: string;

    @ApiPropertyOptional({
        description: "O nome da carga", enum: CargaNome
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsEnum(CargaNome, { message: `Nome de carga inválido` })
    @IsOptional()
    nome_carga?: string;



    @ApiPropertyOptional({
        description: "A data do dia da carga", example: new Date()
    })
    @Type(() => Date)
    @IsDate({ message: 'O campo "data" deve ser uma data!' })
    @IsOptional()
    data?: Date;

}
