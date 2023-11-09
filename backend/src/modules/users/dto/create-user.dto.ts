import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsUUID, Length, MinLength } from 'class-validator';
import { ClearSpecialCharacters } from '../../../shared/utils/strings';
import { IsUniqueCPF } from '../validations/IsUniqueCPF';
import { IsUniqueEmail } from '../validations/IsUniqueEmail';

export class CreateUserDto {
    @ApiProperty({ description: "Nome do usuário", example: "Henrique de Castro" })
    @IsNotEmpty({ message: 'O campo "nome" é obrigatório!' })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    nome: string;

    @ApiProperty({ description: "E-mail do usuário", example: "example@example.com" })
    @IsNotEmpty({ message: 'O campo "email" é obrigatório!' })
    @IsEmail({ message: `Insira um e-mail válido!` })
    @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
    @IsUniqueEmail()
    email: string;


    @ApiProperty({ description: "CPF do usuário", examples: ["123.456.789-99", "12345678999"] })
    @IsNotEmpty({ message: 'O campo "cpf" é obrigatório!' })
    @Length(11, 11, { message: `O CPF deve ter exatamente onze caracteres ` })
    @Transform(({ value }: TransformFnParams) => ClearSpecialCharacters(value))
    @IsUniqueCPF()
    cpf: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    avatar?: string;

    @ApiPropertyOptional({ description: "Perfil de acesso do usuário", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID()
    @IsOptional()
    perfil_id?: string;

    @ApiPropertyOptional({ description: "Cargo do usuário", example: "3f8fd54e-0773-4103-9758-07871885a89e"})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID()
    @IsOptional()
    cargo_id?: string;

    @ApiPropertyOptional({ description: "Loja onde o usuário está alocado", example: "3f8fd54e-0773-4103-9758-07871885a89e"})
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID()
    @IsOptional()
    loja_id?: string;

    @ApiPropertyOptional({
        description: "O nível superior responsável pelo colaborador", example: "3f8fd54e-0773-4103-9758-07871885a89e"
    })
    @IsOptional()
    @IsUUID(null, { message: `O campo "nivel_superior_id" aceita apenas UUID` })
    nivel_superior_id: string;

    senha: string;
}
