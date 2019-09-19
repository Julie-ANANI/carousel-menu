import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../models/innovation';
import { Preset } from '../../../../../../models/preset';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-admin-project-questionnaire',
  templateUrl: './admin-project-questionnaire.component.html',
  styleUrls: ['./admin-project-questionnaire.component.scss']
})
export class AdminProjectQuestionnaireComponent {

  private _project: Innovation;
  private _quizLink: string;

  constructor(private _activatedRoute: ActivatedRoute,
              private _notificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    this._project = this._activatedRoute.snapshot.parent.data['innovation'];
    this.updateQuizLink();
  }

  private updateQuizLink() {
    if (this._project.quizId && Array.isArray(this._project.campaigns) && this._project.campaigns.length > 0) {
      this._quizLink =  `${environment.quizUrl}/quiz/${this._project.quizId}/${this._project.campaigns[0]._id}`;
    }
  }

  public savePreset(_preset: Preset): void {
    const project = { preset: this._project.preset };
    this._innovationService.save(this._project._id, project).subscribe((result: any) => {
      this._project = result;
      this.updateQuizLink();
      this._notificationService.success('ERROR.SUCCESS', 'ERROR.PRESET.UPDATED');
    });
  }

  public generateQuiz(event: Event) {
    event.preventDefault();
    this._innovationService.createQuiz(this._project._id).subscribe((result: any) => {
      this._project = result;
      this.updateQuizLink();
      this._notificationService.success('ERROR.SUCCESS', 'ERROR.QUIZ.CREATED');
    }, (err: any) => {
      this._notificationService.error('ERROR.ERROR', err.message);
    });
  }

  get project() { return this._project; }

  get quizLink() { return this._quizLink; }

}
