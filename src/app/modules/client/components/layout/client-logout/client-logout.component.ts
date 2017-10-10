import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../../../../services/auth/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-logout',
  templateUrl: './client-logout.component.html'
})
export class ClientLogoutComponent implements OnInit {

  constructor(private _authService: AuthService,
              private _location: Location,
              private _titleService: Title,
              private _notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this._titleService.setTitle('Log out'); // TODO translate
    this._authService.logout()
      .subscribe(
        res => {
          this._notificationsService.success('Déconnexion', 'Vous avez été déconnecté'); // TODO translate
          this._location.back();
        },
        error => {
          this._notificationsService.error('Erreur', 'Formulaire non valide'); // TODO translate
          this._location.back();
        });
  }

}
