import { CargaStatus } from "../../../shared/constants/cargta-status.constant";
import { User } from "../../../modules/users/entities/user.entity";

export class CreateCargaDadosDto{
    job_id: string;    
    nome_job: string;    
    nome_carga: string;    
    descricao_carga: string;    
    status: CargaStatus;    
    error_descricao?: string;    
    tabelas_afetadas: string;
    requester_user: User;
}