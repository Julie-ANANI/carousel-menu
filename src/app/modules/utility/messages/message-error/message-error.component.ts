import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-utility-message-error',
  templateUrl: './message-error.component.html',
  styleUrls: ['./message-error.component.scss']
})

export class MessageErrorComponent implements OnInit {

  @Input() errorMessage = '';

  @Input() reloadPage = true;

  constructor(private _translateService: TranslateService) { }

  ngOnInit() {
    if (!this.errorMessage) {
      this.errorMessage = this._translateService.currentLang === 'fr' ? 'Désolé, mais nous avons des difficultés à ' +
        'récupérer les données que vous avez ' +
        'demandées. Cela peut être dû à un problème de connexion au serveur ou à un problème technique.'
        : 'Sorry, but we are having ' +
        'trouble while fetching the data you have requested. It could be because of server connection ' +
        'problem or some technical issue.';
    }
  }

  public onReloadPage(event: Event) {
    event.preventDefault();
    window.location.reload();
  }

}
