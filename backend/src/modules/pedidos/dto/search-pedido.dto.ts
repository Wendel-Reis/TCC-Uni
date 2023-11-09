
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { Transform, TransformFnParams, Type } from "class-transformer";

import { StatusPedido } from './../../../shared/constants/status-pedido.constant';
import { PagamentoFormasEnum } from './../../../shared/constants/pagamento-formas.constant';
import { LocalPedidoEnum } from "./../../../shared/constants/local-pedido.constant";


export class SearchPedidoDto {

    @ApiPropertyOptional({ description: "Data de solicitação/criação do Pedido", example: new Date()})
    @Transform(({ value }: TransformFnParams) => new Date(value))
    @IsOptional()
    @IsDate()
    created_at: Date;

    @ApiPropertyOptional({ description: "ID da loja em que o pedido foi realizado", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @IsOptional()
    @IsUUID(null, { message: `Valor de parametro 'loja_id' inválido! Esperado um UUID` })
    loja_id?: string;

    @ApiPropertyOptional({ description: "ID do vendedor em que o pedido foi realizado", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @IsOptional()
    @IsUUID(null, { message: `Valor de parametro 'vendedor_id' inválido! Esperado um UUID` })
    vendedor_id: string;

    @ApiPropertyOptional({ description: "ID do cliente em que o pedido foi realizado", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @IsOptional()
    @IsUUID(null, { message: `Valor de parametro 'cliente_id' inválido! Esperado um UUID` })
    cliente_id: string;

    @ApiPropertyOptional({ description: "ID/Código do pedido", example: "3f8fd54e-" })
    @IsOptional()
    searchedPedido: string;

    @ApiPropertyOptional({ description: "Nome da loja em que o pedido foi realizado", example: "Loja do centro" })
    @IsOptional()
    searchedLoja?: string;

    @ApiPropertyOptional({ description: "Nome do vendedor em que o pedido foi realizado", example: "Colaborador X" })
    @IsOptional()
    searchedVendedor: string;

    @ApiPropertyOptional({ description: "Nome do cliente em que o pedido foi realizado", example: "Cliente 01" })
    @IsOptional()
    searchedCliente: string;

    @ApiPropertyOptional({ description: "Intervalo mínimo de valor desejado", example: 19.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "min_total" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "min_total" deve ser positivo` })
    min_total: string;

    @ApiPropertyOptional({ description: "Intervalo mínimo de valor desejado", example: 99.99 })
    @Transform(({ value }: TransformFnParams) => Number(value))
    @IsOptional()
    @IsNumber(
        { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 },
        { message: `O campo "max_total" deve ser um número com duas casas decimais e finito` })
    @IsPositive({ message: `O campo "max_total" deve ser positivo` })
    max_total: string;

    @ApiPropertyOptional({ description: "Valor varíavel de desconto ou acréscimo", example: 12.99 })
    @IsOptional()
    acrescimo_desconto?: number;

    @ApiPropertyOptional({ description: "Local onde o pedido foi gerado PDV ou E-Commerce", enum: LocalPedidoEnum })
    @IsOptional()
    @IsEnum(LocalPedidoEnum, { message: `Local inválido` })
    local?: LocalPedidoEnum;

    @ApiPropertyOptional({
        description: "Forma de pagamento", enum: PagamentoFormasEnum
    })
    @IsOptional()
    @IsEnum(PagamentoFormasEnum, { message: `Forma de pagamento inválida` })
    pagamento_forma?: PagamentoFormasEnum;

    @ApiPropertyOptional({
        description: "Status do Pedido", enum: StatusPedido
    })
    @IsOptional()
    @IsEnum(StatusPedido, { message: `Forma de pagamento inválida` })
    status_pedido: StatusPedido;

}