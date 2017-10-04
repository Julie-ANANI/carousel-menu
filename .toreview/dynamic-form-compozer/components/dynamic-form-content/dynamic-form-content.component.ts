import { Component, Input } from '@angular/core';
import { ContentCompozerComponent } from '../../classes/compozer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form-content',
  templateUrl: './dynamic-form-content.component.html',
  styleUrls: ['./dynamic-form-content.component.scss']
})
export class DynamicFormContentComponent {

  @Input() public compozerComponent: ContentCompozerComponent;

  constructor(private _translateService: TranslateService) {
  }
}
