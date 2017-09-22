import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../services/user/user.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { EnvironmentService } from '../../../../services/common/environment.service';
import { MediaService } from '../../../../services/media/media.service';
import { langSelectOptions } from '../../../../data/innovation.data';

@Component({
  selector: 'app-client-innovations',
  templateUrl: './client-innovations.component.html',
  styleUrls: ['./client-innovations.component.scss']
})
export class ClientInnovationsComponent implements OnInit {

  // private _selectedOrderBy: any; TODO
  // private _selectedFilterBy: any; TODO


  private _innovations: [any];
  private _selectLangInput = '';
  private _wantToCreateNewCard = false;


  constructor(private _translateService: TranslateService,
              private _userService: UserService,
              private _innovationService: InnovationService,
              private _titleService: Title,
              private _mediaService: MediaService,
              private _environmentService: EnvironmentService,
              private _router: Router) { }


  ngOnInit(): void {
    this._titleService.setTitle('My innovations'); // TODO translate
    this._userService.getMyInnovations().subscribe(innovations => {
      this._innovations = innovations.innovations;
    });

    this._selectLangInput = this._translateService.currentLang || this._translateService.getBrowserLang() || 'fr';
  }

  createInnovation() {
    const lang = this._selectLangInput;
    const domain = this._environmentService.getDomain();
    const newInnovation = {
      /* country: lang, le serveur
      name: ''
      lang: lang*/
      country: lang,
      domain: domain,
      title: lang === 'fr' ? 'Donnez un nom à votre innovation' : 'Give a name to your innovation',
      lang: lang
    };

    this._innovationService.create(newInnovation).subscribe(innovation =>  {
      this._router.navigate(['/projects/' + innovation._id])
    });
  }

  removeInnovation(innovationId) {
    console.log('innovationId to remove : ' + innovationId);
    this._innovationService.remove(innovationId).subscribe(
      innovationRemoved => this._innovations.splice(this.getInnovationIndex(innovationId), 1));
  }

  getInnovationIndex(innovationId: string): number {
    for (const innovation of this._innovations) {
      console.log(innovationId);
      if (innovationId === innovation._id) {
        return this._innovations.indexOf(innovation);
      }
    }
  }

  getPrincipalMedia(innovation): string {
    if (innovation.media) {
      return this._mediaService.buildUrl(innovation.media.id);
    } else {
      return '/assets/emptyinvention.png';
    }
  }


  get innovations () { // TODO     : Innovation[] { (using server)
    return this._innovations;
  }

  get langOptions(): any {
    return langSelectOptions;
  }

  get selectLangInput(): string {
    return this._selectLangInput;
  }
  set selectLangInput(value: string) {
    this._selectLangInput = value;
  }

  get wantToCreateNewCard(): boolean {
    return this._wantToCreateNewCard;
  }
  set wantToCreateNewCard(value: boolean) {
    this._wantToCreateNewCard = value;
  }
}
