import { User } from "../../../modules/users/entities/user.entity";


export class HistoricoDto{
    tipo: string;
    status: string;
    erro_descricao?: string;
    requester_user: User;
}