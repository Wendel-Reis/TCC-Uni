export interface PerfilDto {
    id: string;
    nome: string;
    descricao: string;
}

export interface SearchPerfilDto {
    with_cliente?: boolean;
}