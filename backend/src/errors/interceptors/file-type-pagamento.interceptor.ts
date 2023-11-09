import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FileTypePagamentoInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) => {
                if (err instanceof HttpException && err.getStatus() === HttpStatus.UNPROCESSABLE_ENTITY) {
                    
                    throw new HttpException(
                        'Formato de arquivo inválido. Os tipos de arquivo permitidos são: JPEG, PNG, PDF, XML, JSON.',
                        HttpStatus.UNPROCESSABLE_ENTITY
                    );
                }
                throw err;
            }),
        );
    }
}
