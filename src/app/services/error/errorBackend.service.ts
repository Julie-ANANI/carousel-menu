import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable()
export class ErrorBackendService extends ErrorService {


  public handleError(error: Error | HttpErrorResponse): void {
    console.error(error);
  }

}
