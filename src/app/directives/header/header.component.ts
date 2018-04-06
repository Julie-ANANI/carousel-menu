import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

 // @Input() backOffice: boolean;

  private backOffice: boolean; // to toggle back office value

  private displayPropertyValue: boolean; // to toggle the value of collapse menu

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this.displayPropertyValue = false;
    this.backOffice = false;
    console.log('first' + this.backOffice);

  }

  public logoName(): string {
    return `logo-${ environment.domain || 'umi.us'}.png`;
  }

  public canShow(reqLevel: number): boolean {
    return reqLevel && (this._authService.adminLevel & reqLevel) === reqLevel;
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
    this.backOffice = value;
    console.log('set' + this.backOffice);
  }

  get backOfficeValue(): boolean {
    console.log('get' + this.backOffice);
    return this.backOffice;
  }

}
