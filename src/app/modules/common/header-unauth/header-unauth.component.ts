import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {SidebarInterface} from '../../sidebar/interfaces/sidebar-interface';
import {FormGroup} from '@angular/forms';
import {TranslateNotificationsService} from '../../../services/notifications/notifications.service';
import {User} from '../../../models/user.model';
import {first} from 'rxjs/operators';
import {AuthService} from '../../../services/auth/auth.service';
import {UserService} from '../../../services/user/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-unauth',
  templateUrl: './header-unauth.component.html',
  styleUrls: ['./header-unauth.component.scss']
})

export class HeaderUnauthComponent implements OnInit {

  sidebarValue: SidebarInterface = {};

  constructor(private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  onClickSignUp(event: Event) {
    event.preventDefault();

    this.sidebarValue = {
      animate_state: this.sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'signup'
    }

  }

  closeSidebar(value: SidebarInterface) {
    this.sidebarValue.animate_state = value.animate_state;
  }

  createUser(formValue: FormGroup) {
    if (formValue.valid) {
      const user = new User(formValue.value);
      user.domain = environment.domain;

      if (user.email.match(/umi.us/gi) && user.domain !== 'umi') {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_DOMAIN');
      } else {
        this.userService.create(user).pipe(first()).subscribe(() => {
          this.authService.login(user).pipe(first()).subscribe(() => {
            this.router.navigate(['/welcome']);
          }, () => {
            this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
          });
        }, () => {
          this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.ALREADY_EXIST');
        });
      }

    } else {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM');
    }
  }

  getLogo(): string {
    return environment.logoURL;
  }

}
