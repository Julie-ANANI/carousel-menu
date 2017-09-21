import { Component, Input } from '@angular/core';
import { HtmlCompozerComponent } from '../../classes/compozer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form-html',
  templateUrl: './dynamic-form-html.component.html',
  styleUrls: ['./dynamic-form-html.component.scss']
})
export class DynamicFormHtmlComponent {

  @Input() compozerComponent: HtmlCompozerComponent;

  constructor(private _translateService: TranslateService) {
  }
}
