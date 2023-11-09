
import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { LojasRepository } from '../repositories/implementations/LojasRepository';

@ValidatorConstraint({ name: 'IsUniqueCodigo', async: true })
@Injectable()
export class IsUniqueCodigoConstraint implements ValidatorConstraintInterface {
    constructor(private readonly repo: LojasRepository) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {

        const loja = await this.repo.findByCodigo(value);

        if (loja) {
            return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `Já existe uma loja com este código!`;
    }
}

export function IsUniqueCodigo(
    validationOptions?: ValidationOptions,
) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueCodigoConstraint,
        });
    };
}