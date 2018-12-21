import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss'],
})

export class DiscoverComponent {

  constructor(public authService: AuthService,
              private router: Router) {

    if (this.authService.isAuthenticated) {
      this.router.navigate(['/user/discover/result'], { queryParamsHandling: 'merge' });
    }

  }

}
