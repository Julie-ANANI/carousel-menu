import {Component, OnDestroy, OnInit} from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  ngUnsubscribe: Subject<any> = new Subject();

  displayLoader = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
      setTimeout(() => {
        this.displayLoader = isLoading;
      });
    });
  }

  ngOnInit() { }

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
