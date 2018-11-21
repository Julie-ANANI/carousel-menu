import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService implements OnDestroy {

  private _isLoadingSubject = new Subject<boolean>();

  private _nbInProgressRequests = 0;

  constructor() {
    this._isLoadingSubject.next(false);
  }

  public startLoading (): void {
    ++this._nbInProgressRequests;
    this._isLoadingSubject.next(true);
  }

  public stopLoading (): void {
    --this._nbInProgressRequests;
    if (this._nbInProgressRequests <= 0) {
      this._isLoadingSubject.next(false);
      this._nbInProgressRequests = 0;
    }
  }

  ngOnDestroy() {
    this._isLoadingSubject.complete();
  }
}
