import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  templateUrl: './public-discover.component.html',
  styleUrls: ['./public-discover.component.scss'],
})

export class PublicDiscoverComponent {

  constructor(public authService: AuthService) { }

}
