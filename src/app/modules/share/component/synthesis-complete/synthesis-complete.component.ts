import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-synthesis-online',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {
  projectId: string;

  project: Innovation;

  displaySpinner = true;

  constructor(private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotififcationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this.translateTitleService.setTitle('SHARE.TITLE');

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
    });

    this.getProject();
  }

  private getProject() {
    this.innovationService.get(this.projectId).subscribe((response: Innovation) => {
      this.project = response;
    }, () => {
      this.translateNotififcationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR')
    }, () => {
      this.displaySpinner = false;
    });
  }

}
