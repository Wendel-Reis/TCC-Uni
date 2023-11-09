import { PartialType } from '@nestjs/swagger';
import { CreateEstoquesHistoricoDto } from './create-estoques-historico.dto';

export class UpdateEstoquesHistoricoDto extends PartialType(CreateEstoquesHistoricoDto) {}
