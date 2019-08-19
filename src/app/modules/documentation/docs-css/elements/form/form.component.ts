import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-form',
  styleUrls: ['../../docs-css.component.scss'],
  templateUrl: './form.component.html'
})

export class FormComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      let checkbox = document.getElementById('select-all');
      (checkbox as HTMLInputElement).indeterminate = true;
    }
  }

}

