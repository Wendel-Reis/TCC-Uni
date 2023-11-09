
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ProdutosRepository } from '../repositories/implementations/ProdutosRepository';

@ValidatorConstraint({ name: 'IsUniqueNome', async: true })
@Injectable()
export class IsUniqueNomeConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: ProdutosRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const { id } = args.object as any;

        const produto = await this.repo.findByNome(value);

        if (produto && produto.id !== id) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe um produto com este nome!`;
    }
}

export function IsUniqueNome(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueNomeConstraint,
        });
    };
}