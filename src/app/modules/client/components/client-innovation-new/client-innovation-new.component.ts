import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-innovation-new',
  templateUrl: './client-innovation-new.component.html',
  styleUrls: ['./client-innovation-new.component.styl']
})
export class ClientInnovationNewComponent implements OnInit {

  public compozer: any[];
  public payLoad = '';

  constructor(private _notificationsService: NotificationsService,
              private _titleService: Title) { }

  ngOnInit(): void {
    this._titleService.setTitle('New Innovation'); // TODO translate
  }

  onSubmit(form): void {
    this.payLoad = JSON.stringify(form.value);
  }

}
