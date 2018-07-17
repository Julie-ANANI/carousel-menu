import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-shared-not-found',
  templateUrl: './shared-not-found.component.html',
  styleUrls: ['./shared-not-found.component.scss']
})
export class SharedNotFoundComponent implements OnInit {

  constructor(private _titleService: TranslateTitleService,
              private _router: Router,) {}

  ngOnInit(): void {
    this._titleService.setTitle('404.PAGE_NOT_FOUND');

    /**
     * Go somewhere else
     */
    setTimeout(()=>{
      this._router.navigate(['/'] );
    }, 2000);
  }

}
