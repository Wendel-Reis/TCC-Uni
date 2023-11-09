
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { LojasRepository } from '../repositories/implementations/LojasRepository';

@ValidatorConstraint({ name: 'IsUniqueNome', async: true })
@Injectable()
export class IsUniqueNomeConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: LojasRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const { id } = args.object as any;

        const loja = await this.repo.findByNome(value);

        if (loja && loja.id !== id) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe uma loja com este nome!`;
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