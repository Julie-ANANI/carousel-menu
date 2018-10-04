import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-synthesis-online',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {
  projectId: string;

  shareKey: string;

  project: Innovation;

  displaySpinner = true;

  notFound = false;

  constructor(private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private _authService: AuthService) { }

  ngOnInit() {
    this.translateTitleService.setTitle('SHARE.TITLE');

    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.shareKey = params['shareKey'];
      this.getProject();
    });

  }

  private getProject() {
    this.innovationService.getSharedSynthesis(this.projectId, this.shareKey).first().subscribe((response: any) => {
        this.project = response;
      }, () => {
        this.displaySpinner = false;
        this.notFound = true;
      }, () => {
        this.displaySpinner = false;
      });
  }

  get authService() {
    return this._authService;
  }

}
