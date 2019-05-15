import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoaderService implements OnDestroy {

  private _isLoadingSubject = new Subject<boolean>();

  isLoading$: Observable<boolean> = this._isLoadingSubject.asObservable();

  private _nbInProgressRequests = 0;

  constructor() {
    this._isLoadingSubject.next(false);
  }

  startLoading (): void {
    ++this._nbInProgressRequests;
    this._isLoadingSubject.next(true);
  }

  stopLoading (): void {
    --this._nbInProgressRequests;
    if (this._nbInProgressRequests <= 0) {

      this._nbInProgressRequests = 0;

      setTimeout(() => {
        this._isLoadingSubject.next(false);
      }, 500);

    }
  }

  ngOnDestroy() {
    this._isLoadingSubject.complete();
  }
}
