import {Component, OnDestroy, OnInit} from '@angular/core';
import { LoaderService } from '../../services/loader/loader.service';
import { takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';

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

    console.log(this.displayLoader);

    this.loaderService.isLoading$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isLoading: boolean) => {
      setTimeout(() => {
        this.displayLoader = isLoading;
        console.log(this.displayLoader);
      })
    });

    this.loaderService.stopLoading();

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
