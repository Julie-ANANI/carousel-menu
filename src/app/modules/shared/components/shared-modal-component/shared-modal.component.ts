import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'modal',
  templateUrl:  './shared-modal.component.html'
})


export class SharedModalComponent implements OnInit {

  @Input() title;
  @Input() content;

  ngOnInit() {}

}
