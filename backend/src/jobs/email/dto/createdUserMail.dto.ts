import { BasicJobDto } from "../../../jobs/BasicJob.dto";

export class CreatedUserMailDto extends BasicJobDto{
    loja_nome: string;
    nome: string;
    email: string;
    senha: string;
}