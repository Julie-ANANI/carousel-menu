import {Component, OnInit} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { InnovationPreviewSidebarService } from '../../services/innovation-preview-sidebar.service';

@Component({
  selector: 'app-innovation-preview-sidebar',
  templateUrl: './innovation-preview-sidebar.component.html',
  styleUrls: ['./innovation-preview-sidebar.component.scss'],
  animations: [
    trigger('sidebarAnimate', [
      state('inactive', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('inactive => active', animate('700ms ease-in-out'))
    ])
  ]
})

export class InnovationPreviewSidebarComponent implements OnInit {

  title: string;
  state: string;
  innovDetail = {
    'id': '',
    'lang': ''
  };

  constructor(private innovationPreviewSidebarService: InnovationPreviewSidebarService) {
  }

  ngOnInit() {
    this.state = 'inactive';

    /*
        receiving the template values and innovation values sent by the parent component.
     */
    this.innovationPreviewSidebarService.getValues().subscribe(res => {
      if (res !== null) {
        this.state = res.animate;
        this.title = res.title;
        this.innovDetail.id = res.id;
        this.innovDetail.lang = res.lang;
      }
    });

  }

  toggleState() {
    this.state = 'inactive';
    this.innovDetail.id = '';
    this.innovDetail.lang = '';
  }

}
