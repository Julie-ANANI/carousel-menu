import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-shared-csv-error',
  templateUrl: './shared-csv-error.component.html'
})
export class SharedCsvErrorComponent implements OnInit {

  @Input() error: { column: string; lines: string; error: string };
  @Input() htmlTag: 'li' | 'span' = 'span';

  constructor() {
  }

  ngOnInit(): void {
  }

}
