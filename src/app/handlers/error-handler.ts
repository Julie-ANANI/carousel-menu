import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../services/error/error.service';

const loadingChunkErrorRegex = /^Uncaught \(in promise\): Error: Loading chunk [0-9]+ failed\./;

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {

    const { name, message } = error;

    if (name === 'Error' && message.match(loadingChunkErrorRegex)) {
      // the first time we get a loading chunks error we try to reload the page
      const activatedRoute = this.injector.get(ActivatedRoute);
      if (!activatedRoute.snapshot.queryParams.reload) {
        const routerService = this.injector.get(Router);
        routerService.navigate([], { relativeTo: activatedRoute, queryParams: { reload: true }, queryParamsHandling: 'merge' });
        window.location.reload(true);
        return;
      }
    }

    // else do nothing and send the error to the errorService
    const errorService = this.injector.get(ErrorService);
    errorService.handleError(error);

  }

}
