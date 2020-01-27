import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorFrontService {

  constructor() {}

  public static getErrorMessage(status?: number): string {
    if (status) {
      switch (status) {

        case 401:
          return 'ERROR.NO_AUTHORIZED';

        case 403:
          return 'ERROR.NO_PERMISSION';

        case 404:
          return 'ERROR.URL_NOT_FOUND';

        default:
          return 'ERROR.OPERATION_ERROR';

      }
    }

    return 'ERROR.OPERATION_ERROR';

  }

  /***
   * this function will check the error and navigate to the
   * page to show error.
   * @param error
   * @param sourceType - page where error is generated
   */
  /*public showError(error: HttpErrorResponse, sourceType: string) {
    if (error && sourceType) {
      this._authenticationService.errorUrl = sourceType;
      this._router.navigate(['errors'], {
        queryParams: {
          'source': sourceType,
          'status': error.status,
          'error-value': true }
      });
    }
  }*/

  /***
   * show specific error
   * @param status
   * @param sourceType
   */
  /*public showSpecificError(status: string, sourceType: string) {
    if (status && sourceType) {
      this._router.navigate(['errors'], {
        queryParams: {
          'source': sourceType,
          'status': status,
          'error-value': true }
      });
    }
  }*/

}
