import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

 // @Input() backOffice: boolean;

  private backValue: boolean; // hold back office value

  private displayPropertyValue: boolean; // hold the value of collapse menu

  constructor(private _authService: AuthService,
              private _location: Location) {}

  ngOnInit() {
    this.displayPropertyValue = false;
    this.backValue = false;
    this.backOfficeValue = this._location.path().slice(0, 6) === '/admin';
  }

  public logoName(): string {
    // return `logo-${ environment.domain || 'umi.us'}.png`;
    return environment.logoURL;
  }

  public canShow(reqLevel: number): boolean {
    return reqLevel && ( this._authService.adminLevel & reqLevel) === reqLevel;
  }

  get authService (): AuthService {
    return this._authService;
  }

  set displayValue(value: boolean) {
    this.displayPropertyValue = value;
  }

  get displayValue(): boolean {
    return this.displayPropertyValue;
  }

  set backOfficeValue(value: boolean) {
    this.backValue = value;
  }

  get backOfficeValue(): boolean {
    return this.backValue;
  }


}
