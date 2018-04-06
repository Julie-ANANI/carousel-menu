import {Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() backOffice: boolean;

  private _displayValue: boolean; // to toggle the value of collapse menu

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this._displayValue = false;
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

  toggleState() {
    this._displayValue = !this._displayValue;
  }

  get displayValue(): boolean {
    return this._displayValue;
  }

}
