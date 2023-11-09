
import { StatusUsuarioEnum } from "../../constants/status.constant";
import { TipoUsuarioEnum } from "../../constants/tipo-user.constant";
import { EnderecoDto } from "../enderecos/endereco.dto";
import { LojaDto } from "../lojas/loja.dto";
import { PerfilDto } from "../perfis/perfil.dto";

export interface UserDto {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    avatar_url: string | null;
    status: boolean;
    socket_id: string | null;
    perfil: PerfilDto | null;
    endereco: EnderecoDto | null;
    loja: LojaDto | null;
    nivel_superior?: UserDto | null;

}

export interface LabedUser extends UserDto {
    label: string;
}

export interface CreateUserDto {
    nome: string;
    email: string;
    senha?: string;
    cpf: string;
    loja_id: string;
    perfil_id: string;
    cargo_id?: string;
    nivel_superior_id?: string;
}

export interface UpdateUserDto {
    nome?: string;
    status?: string;
    loja_id?: string;
    perfil_id?: string;
    cargo_id?: string;
    nivel_superior_id?: string;
}

export interface SearchUserDto {
    loja_id?: string;
    searchedUser?: string;
    nome?: string;
    email?: string;
    cpf?: string;
    status?: string;
    tipo_usuario?: TipoUsuarioEnum;
    load_cliente_nao_identificado?: boolean;
}