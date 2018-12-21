import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})

export class DiscoverComponent {

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
  }

}
