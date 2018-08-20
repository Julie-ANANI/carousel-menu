import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Innovation } from '../../../../../models/innovation';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-admin-project-cards',
  templateUrl: 'admin-project-cards.component.html',
  styleUrls: ['admin-project-cards.component.scss']
})

export class AdminProjectCardsComponent implements OnInit {

  project: Innovation;
  shouldSave = false;
  lastSavedDate: Date;

  constructor(private activatedRoute: ActivatedRoute,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit(): void {
    this.project = this.activatedRoute.snapshot.parent.data['innovation'];
  }

  public save(event: Event): void {
    event.preventDefault();

    this.innovationService.save(this.project._id, this.project).first()
      .subscribe((data: Innovation) => {
        this.lastSavedDate = new Date(data.updated);
        this.shouldSave = false;
        this.project = data;
      }, err => {
        this.translateNotificationsService.error('ERROR.PROJECT.UNFORBIDDEN', err);
      });
  }

  commentKeyupHandlerFunction(event: { content: string }) {
    this.project.comments = event['content'];
    this.shouldSave = true;
  }

  public updateProject(event: Innovation) {
    this.project = event;
    this.shouldSave = true;
  }

  public validateProject (): void {
    this.innovationService.validate(this.project._id).first().subscribe(_ => {
      this.translateNotificationsService.success('Projet validé', 'Le projet a bien été validé');
    });
  }

  public askRevision (): void {
    this.innovationService.askRevision(this.project._id).first().subscribe(_ => {
      this.translateNotificationsService.success('Projet en révision', 'Le projet a été passé en status de révision, veuillez avertir le propriétaire des chagements à effectuer');
    });
  }

}
