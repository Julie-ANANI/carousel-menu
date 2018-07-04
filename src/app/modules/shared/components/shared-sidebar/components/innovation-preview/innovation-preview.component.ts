import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-innovation-preview',
  templateUrl: './innovation-preview.component.html',
  styleUrls: ['./innovation-preview.component.scss']
})
export class InnovationPreviewComponent implements OnInit, OnChanges {

  @Input() sidebarState: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
