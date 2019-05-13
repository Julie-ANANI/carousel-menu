import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { AuthService } from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-synthesis-complete',
  templateUrl: './synthesis-complete.component.html',
  styleUrls: ['./synthesis-complete.component.scss']
})

export class SynthesisCompleteComponent implements OnInit {

  private _projectId: string;

  private _shareKey: string;

  private _project: Innovation;

  private _displayReport = false;

  private _notFound = false;

  constructor(private _translateTitleService: TranslateTitleService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _authService: AuthService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.SHARED_REPORTS');

    this._activatedRoute.params.subscribe(params => {
      this._projectId = params['projectId'];
      this._shareKey = params['shareKey'];
    });

  }

  ngOnInit() {
    this.getProject();
  }

  /***
   * this function is to get the shared synthesis detail from the server.
   */
  private getProject() {
    this._innovationService.getSharedSynthesis(this._projectId, this._shareKey).subscribe((response: any) => {
      this._project = response;
      }, () => {
      this._displayReport = false;
      this._notFound = true;
      }, () => {
      if (this._project !== undefined) {
        this._displayReport = true;
      } else {
        this._notFound = true;
      }
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

  get displayReport(): boolean {
    return this._displayReport;
  }

  get notFound(): boolean {
    return this._notFound;
  }

}
