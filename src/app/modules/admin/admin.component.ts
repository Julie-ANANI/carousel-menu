import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent {

  private _scrollButton = false;

  constructor(private authService1: AuthService) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.getCurrentScrollTop() > 10) {
      this._scrollButton = true;
    } else {
      this._scrollButton = false;
    }
  }

  getCurrentScrollTop() {
    if (typeof window.scrollY !== 'undefined' && window.scrollY >= 0) {
      return window.scrollY;
    }
    return 0;
  };

  scrollToTop(event: Event) {
    event.preventDefault();
    window.scrollTo(0, 0);
  }

  get scrollButton(): boolean {
    return this._scrollButton;
  }

  get authService(): AuthService {
    return this.authService1;
  }

}
