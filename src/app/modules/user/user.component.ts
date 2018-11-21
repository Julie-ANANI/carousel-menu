import {Component, OnDestroy, OnInit} from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject();

  displayLoader = true;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
      setTimeout(() => {
        this.displayLoader = isLoading;
      }, 400);
    });
  }

  getLogo(): string {
    return environment.logoURL;
  }

  getDomain(): string {
    return environment.domain;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
