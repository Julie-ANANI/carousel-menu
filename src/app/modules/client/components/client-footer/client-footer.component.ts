import {Component, OnInit} from "@angular/core";
import {TranslateService, initTranslation} from "./i18n/i18n";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-client-footer',
  templateUrl: './client-footer.component.html',
  styleUrls: ['./client-footer.component.styl']
})
export class ClientFooterComponent implements OnInit {
  private _companyName: string = environment.companyName;

  constructor (private _translateService: TranslateService) {}

  ngOnInit(): void {
    initTranslation(this._translateService);
  }

  get companyName() :string {
    return this._companyName;
  }

}
