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

  private _projectId: string;

  private _shareKey: string;

  private _project: Innovation;

  private _displaySpinner = true;

  private _notFound = false;

  constructor(private translateTitleService: TranslateTitleService,
              private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private _authService: AuthService) { }

  ngOnInit() {
    this.translateTitleService.setTitle('SHARE.TITLE');

    this.activatedRoute.params.subscribe(params => {
      this._projectId = params['projectId'];
      this._shareKey = params['shareKey'];
      this.getProject();
    });

  }

  /***
   * This function is to get the shared synthesis detail from the server.
   */
  private getProject() {
    this.innovationService.getSharedSynthesis(this._projectId, this._shareKey).subscribe((response: any) => {
        this._project = response;
      }, () => {
        this._displaySpinner = false;
        this._notFound = true;
      }, () => {
        this._displaySpinner = false;
      });
  }

  get authService() {
    return this._authService;
  }

  get projectId(): string {
    return this._projectId;
  }

  get shareKey(): string {
    return this._shareKey;
  }

  get project(): Innovation {
    return this._project;
  }

  get displaySpinner(): boolean {
    return this._displaySpinner;
  }

  get notFound(): boolean {
    return this._notFound;
  }

}
