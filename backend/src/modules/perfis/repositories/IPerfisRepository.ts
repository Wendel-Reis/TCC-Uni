import { PageOptionsDto } from "./../../../shared/dtos/page/page-options.dto";
import { Perfil } from "../entities/perfil.entity";
import { SearchPerfilDto } from "../dto/search-perfil.dto";


interface IPerfisRepository {
  findByNome(nome: string): Promise<Perfil>;
  findById(id: string): Promise<Perfil>;
  list(pageOptionsDto: PageOptionsDto, options?: SearchPerfilDto): Promise<[Perfil[], number]>;
}

export { IPerfisRepository };
