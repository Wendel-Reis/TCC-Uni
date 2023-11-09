import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CargaDescricao, CargaNome } from '../../../shared/constants/carga-tipos.constant';

export class EnumsCargasDto {

    @ApiProperty({ description: "Nome da carga", enum: CargaNome })
    nome_carga: string;

    @ApiProperty({ description: "Descrição da carga", enum: CargaDescricao })
    descricao_carga: string;

}