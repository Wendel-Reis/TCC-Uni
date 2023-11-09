
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, } from "class-transformer";
import { v4 as uuidV4 } from "uuid";
import { Estoque } from "../../../modules/estoques/entities/estoque.entity";
import { FolderPathEnum } from './../../../shared/constants/folder-path.constant';
import { DefaultValuesUtils } from './../../../shared/utils/defaultValuesUtils';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../../../modules/users/entities/user.entity";
import { getFileUrl } from './../../../shared/utils/fileLoader';

@Entity("produtos")
export class Produto {

    @ApiProperty({ description: "ID do produto", example: "3f8fd54e-0773-4103-9758-07871885a89e" })
    @PrimaryColumn()
    id: string;

    @ApiProperty({ description: "Nome do produto", example: "Xbox Series X" })
    @Column()
    nome: string;

    @ApiProperty({ description: "Descrição do produto", example: "Console de última geração da Microsoft" })
    @Column()
    descricao: string;

    @ApiProperty({ description: "Preço de compra do produto", example: 3000 })
    @Column()
    preco_compra: number;

    @ApiProperty({ description: "Preço de venda do produto", example: 5000 })
    @Column()
    preco_venda: number;

    @ApiProperty({ description: "O estoque do produto nas lojas", type: () => Estoque })
    @OneToMany(() => Estoque, (estoque) => estoque.produto)
    estoques: Estoque[];

    @ApiProperty({ description: "Usuário que cadastrou o produto", type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: "user_registrou_id" })
    @Expose({ groups: ["find"] })
    user_registrou: User;

    @ApiProperty({ description: "Documento do comprovante de pagamento anexado à solicitação", example: "DOC-exemplo.pdf" })
    @Column()
    imagem_principal?: string;

    @ApiProperty({ description: "URL da imagem principal do produto", example: "https://exemplo/DOC-exemplo.pdf" })
    @Expose()
    get imagem_principal_url(): string {
        const { bucket, provedor } = process.env.MODE == 'DEV' ?
            DefaultValuesUtils.getDevelopmentProviderAndBucket() :
            DefaultValuesUtils.getProductionProviderAndBucket();

        return this.imagem_principal ? getFileUrl(this.imagem_principal, FolderPathEnum.PRODUTO_IMAGEM_PRINCIPAL, bucket, provedor) : null
    }

    @CreateDateColumn()
    @Exclude()
    created_at: Date;

    @UpdateDateColumn()
    @Exclude()
    updated_at: Date;

    @DeleteDateColumn()
    @Exclude()
    deleted_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}

