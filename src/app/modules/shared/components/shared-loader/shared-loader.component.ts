import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../../../../services/loader/loader.service';

@Component({
  selector: 'app-shared-loader',
  template: '<div class="loading loading-lg" *ngIf="show"></div>'
})
export class SharedLoaderComponent implements OnInit, OnDestroy {
  public show = true;
  private _subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this._subscription = this.loaderService.isLoading$.subscribe((isLoading: boolean) => {
      this.show = isLoading;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
