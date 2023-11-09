import { PageOptionsDto } from "../../../shared/dtos/page/page-options.dto";
import { FilterProdutoDto } from "../dto/filter-produto.dto";
import { Produto } from "../entities/produto.entity";

interface IProdutosRepository {
  findByNome(nome: string): Promise<Produto>;
  findById(id: string): Promise<Produto>;
  list(pageOptionsDto: PageOptionsDto, filterOptions: FilterProdutoDto): Promise<[Produto[], number]>;
  findByIdOrNome(idOrNome: string): Promise<Produto>;
}

export { IProdutosRepository };
