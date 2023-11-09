import { PartialType } from '@nestjs/swagger';
import { CreateProdutosHistoricoDto } from './create-produtos-historico.dto';

export class UpdateProdutosHistoricoDto extends PartialType(CreateProdutosHistoricoDto) {}
