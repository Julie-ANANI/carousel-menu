import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Compozer } from '../../classes/compozer';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.styl']
})
export class DynamicFormComponent implements OnInit {

  public form: FormGroup;

  @Input() public compozer: Compozer;
  @Input() public submitButton: string;
  @Output() public formOnSubmit: EventEmitter <FormGroup> = new EventEmitter();
  @Output() public formOnInit: EventEmitter <FormGroup> = new EventEmitter();

  constructor(private _translateService: TranslateService) { }

  ngOnInit(): void {
    this.prepareForm();

    if (!this.submitButton) {
      this._translateService.get('COMMON.SAVE').subscribe((res: string) => {
        this.submitButton = res;
      });
    }

    if (!this.formOnSubmit.observers.length) {
      console.warn('Form does not have submit callback function. You should provide one in <app-dynamic-form> tag with (formOnSubmit) @Input.');
    }
    this.formOnInit.emit(this.form);
  }

  public prepareForm (): void {
    const compozerComponents = this.compozer.getComponents(); // On extrait toutes les compozerComponents des rows pour les avoir au même endroit

    const group: any = {};
    compozerComponents.forEach(component => {
      if (component.compozerType === 'question') {
        group[component.key] = new FormControl(component.value || '', component.validators);
      }
    });
    this.form = new FormGroup(group);
  }

  public onSubmit (): void {
    this.formOnSubmit.emit(this.form);
  }
}
