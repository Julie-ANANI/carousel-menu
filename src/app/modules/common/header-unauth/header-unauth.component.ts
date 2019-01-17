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
import {MouseService} from '../../../services/mouse/mouse.service';

@Component({
  selector: 'app-header-unauth',
  templateUrl: './header-unauth.component.html',
  styleUrls: ['./header-unauth.component.scss']
})

export class HeaderUnauthComponent implements OnInit {

  sidebarValue: SidebarInterface = {};

  toggleSignInForm = false;

  constructor(private translateNotificationsService: TranslateNotificationsService,
              private authService: AuthService,
              private userService: UserService,
              private router: Router,
              private mouseService: MouseService) { }

  ngOnInit() {
    this.mouseService.getClickEvent().subscribe((event: Event) => {
      if (event && event.target && event.target['id'] !== 'button-signIn' && event.target['id'] !== 'header-unauth-signInForm'
        && event.target['parentNode']['id'] !== 'header-unauth--signInForm'
        && event.target['parentNode']['offsetParent']
        && event.target['parentNode']['offsetParent']['id'] !== 'header-unauth--signInForm') {
        this.toggleSignInForm = false;
      }
    });
  }


  onClickSignIn(event: Event) {
    event.preventDefault();
    this.toggleSignInForm = !this.toggleSignInForm;
  }


  /***
   * this function open the sign up sidebar where user can
   * fill the details to register in the platform.
   * @param event
   */
  onClickSignUp(event: Event) {
    event.preventDefault();

    this.sidebarValue = {
      animate_state: this.sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIGN_UP.HEADING_SIDEBAR',
      type: 'signup'
    }

  }

  /***
   * this closes the sign up sidebar.
   * @param value
   */
  closeSidebar(value: SidebarInterface) {
    this.sidebarValue.animate_state = value.animate_state;
  }


  /***
   * this function is to register the new client.
   * @param formValue
   */
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
