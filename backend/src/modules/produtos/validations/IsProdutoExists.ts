
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ProdutosRepository } from '../repositories/implementations/ProdutosRepository';

@ValidatorConstraint({ name: 'IsProdutoExists', async: true })
@Injectable()
export class IsProdutoExistsConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: ProdutosRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const produto = await this.repo.findById(value);

        if (!produto) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `O produto não existe`;
    }
}

export function IsProdutoExists(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsProdutoExistsConstraint,
        });
    };
}