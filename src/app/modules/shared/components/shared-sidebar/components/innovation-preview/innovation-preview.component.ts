import { Component, Input, OnInit } from '@angular/core';
import { InnovCard } from '../../../../../../models/innov-card';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-innovation-preview',
  templateUrl: './innovation-preview.component.html',
  styleUrls: ['./innovation-preview.component.scss']
})

export class InnovationPreviewComponent implements OnInit {

  @Input() innovation: InnovCard;

  constructor(private domSanitizer1: DomSanitizer) {}

  ngOnInit() {}

  get domSanitizer() {
    return this.domSanitizer1;
  }

}
