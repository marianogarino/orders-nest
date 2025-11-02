import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    console.log(`Incoming request ${method} ${url}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`Requested ${method} ${url} - ${Date.now() - start}ms`),
        ),
      );
  }
}
