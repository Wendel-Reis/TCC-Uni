import { FilterLojaDto } from "../dto/filter-loja.dto";
import { Loja } from "../entities/loja.entity";
import { PageOptionsDto } from "../../../shared/dtos/page/page-options.dto";


interface ILojasRepository {
  findByNome(nome: string): Promise<Loja>;
  findByCodigo(codigo: string): Promise<Loja>;
  findById(id: string): Promise<Loja>;
  list(pageOptionsDto: PageOptionsDto, filterDto: FilterLojaDto): Promise<[Loja[], number]>;
  findByIdOrNomeOrCodigo(idOrNomeOrCodigo: string): Promise<Loja>;
}

export { ILojasRepository };
