import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrls: ['./not-found-page.component.scss']
})

export class NotFoundPageComponent implements OnInit {

  constructor(private translateTitleService: TranslateTitleService,
              private _router: Router) {}

  ngOnInit(): void {
    this.translateTitleService.setTitle('404.PAGE_NOT_FOUND');

    /**
     * Go somewhere else
     */
    setTimeout(()=>{
      this._router.navigate(['/'] );
    }, 2000);
  }
}
