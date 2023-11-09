import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID, ValidateNested } from 'class-validator';

import { IsCliente } from '../../../modules/users/validations/IsCliente';
import { IsFuncionario } from '../../../modules/users/validations/IsFuncionario';
import { PagamentoFormasEnum } from '../../../shared/constants/pagamento-formas.constant';
import { CreateItemProdutoDto } from './create-item-produto.dto';

export class CreatePedidoDto {

    @ApiProperty({ description: "O item de produto", isArray: true })
    @Type(() => CreateItemProdutoDto)
    @ValidateNested()
    item_produto: CreateItemProdutoDto[];

    cliente_id: string;

    @ApiProperty({
        description: "O percentual do desconto", enum: PagamentoFormasEnum
    })
    @IsEnum(PagamentoFormasEnum, { message: `Forma de pagamento inválida` })
    pagamento_forma: PagamentoFormasEnum;

    @ApiPropertyOptional({ description: "ID do vendedor", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsFuncionario()
    @IsOptional()
    vendedor_id: string;

    @ApiPropertyOptional({ description: "ID da loja de venda, se não passada, será atribuído automáticamente a loja do vendedor", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsUUID(null, { message: `Valor de parametro inválido! Esperado um UUID` })
    @IsOptional()
    loja_id: string;

    @ApiPropertyOptional({
        description: "O valor do desconto", example: 9.99
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_desconto"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_desconto"  deve ser um número positivo` })
    @IsOptional()
    valor_desconto: number;

    @ApiPropertyOptional({
        description: "O valor de acréscimo", example: 9.99
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "valor_acrescimo"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "valor_acrescimo"  deve ser um número positivo` })
    @IsOptional()
    valor_acrescimo: number;

    @ApiPropertyOptional({
        description: "O percentual do desconto", example: 50
    })
    @IsNumber({ allowInfinity: false, allowNaN: false },
        { message: `O campo "percentual_desconto"  deve ser um número inteiro` })
    @IsPositive({ message: `O campo "percentual_desconto"  deve ser um número positivo` })
    @IsOptional()
    percentual_desconto: number;

    @ApiPropertyOptional({
        description: "O percentual de acréscimo", example: 50
    })
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "percentual_acrescimo"  deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "percentual_acrescimo"  deve ser um número positivo` })
    @IsOptional()
    percentual_acrescimo: number;

    @ApiProperty({
        description: "Justificativa do desconto ou acréscimo", example: "Desconto de 10% por fidelidade"
    })
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsOptional()
    descricao: string;
}
