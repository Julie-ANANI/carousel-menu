import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../services/error/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {

    const errorService = this.injector.get(ErrorService);
    errorService.handleError(error);

  }

}
