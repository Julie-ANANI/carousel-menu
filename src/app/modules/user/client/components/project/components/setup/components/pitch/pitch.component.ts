import {Component, OnDestroy, OnInit} from '@angular/core';
import {Innovation} from '../../../../../../../../../models/innovation';
import {PitchHelpFields} from '../../../../../../../../../models/static-data/project-pitch';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {MissionFrontService} from '../../../../../../../../../services/mission/mission-front.service';
import {Mission} from '../../../../../../../../../models/mission';
import {Subject} from 'rxjs';
import {InnovCard} from '../../../../../../../../../models/innov-card';
import {SidebarInterface} from '../../../../../../../../sidebars/interfaces/sidebar-interface';
import {InnovationService} from '../../../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../../../../../services/error/error-front.service';

@Component({
  selector: 'app-project-pitch',
  templateUrl: './pitch.component.html',
  styleUrls: ['./pitch.component.scss']
})

export class PitchComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _activeCardIndex = 0;

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _isSaving = false;

  private _cardContent: any = '';

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
    });

    this._innovationFrontService.activeCardIndex().pipe(takeUntil(this._ngUnsubscribe)).subscribe((cardIndex) => {
      this._activeCardIndex = cardIndex;
    });
  }

  public isFilled(field: string): boolean {
    switch (field) {

      case 'TITLE':
        return !!this.activeInnovCard.title;

      case 'SUMMARY':
        return !!this.activeInnovCard.summary;

    }

    return false;
  }

  public openSidebar(field: string) {

    switch (field) {

      case 'TITLE':
        this._cardContent = this.activeInnovCard.title;
        break;

      case 'SUMMARY':
        this._cardContent = this.activeInnovCard.summary;
        break;

    }

    this._sidebarValue = {
      animate_state: 'active',
      type: field,
      size: '726px',
      title: 'SIDEBAR.PROJECT_PITCH.' + field
    };

  };

  public onSaveProject(event: {type: string, content: any}) {
    if (event.type) {
      switch (event.type) {

        case 'TITLE':
          this._innovation.innovationCards[this._activeCardIndex].title = event.content;
          break;

        case 'SUMMARY':
          this._innovation.innovationCards[this._activeCardIndex].summary = event.content;
          break;

      }

      this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe((innovation) => {
        this._innovationFrontService.setInnovation(innovation);
        this._isSaving = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isSaving = false;
        console.error(err);
      });

    }
  }

  get activeInnovCard(): InnovCard {
    return InnovationFrontService.activeCard(this._innovation, this._activeCardIndex);
  }

  get pitchHelp(): PitchHelpFields {
    return MissionFrontService.objectiveInfo(<Mission>this._innovation.mission,
      'PITCH_HELP', this.activeInnovCard.lang);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get isSaving(): boolean {
    return this._isSaving;
  }

  set isSaving(value: boolean) {
    this._isSaving = value;
  }

  get cardContent(): any {
    return this._cardContent;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
