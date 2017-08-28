import { Component, OnInit, ViewChild } from '@angular/core';
import { Compozer } from '../../../../utils/dynamic-form-compozer/classes/compozer';
import { DynamicFormComponent } from '../../../../utils/dynamic-form-compozer/components/dynamic-form/dynamic-form.component';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-admin-quiz-editor',
  templateUrl: './admin-quiz-editor.component.html',
  styleUrls: ['./admin-quiz-editor.component.styl']
})
export class AdminQuizEditorComponent implements OnInit {


  public compozerObject: object[][] = []; // final live object

  public compozerComponent: Compozer;
  public compozerComponentTmpRow: Compozer;


  // Edition
  public tmpNewRow: object[];
  public tmpComponent = {
    compozerType: null,
    columns: 12,
    value: null
  };

  public stringCompozerObject: string;

  @ViewChild(DynamicFormComponent) child: DynamicFormComponent;

  constructor(private _notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.compozerComponent = new Compozer();
    this.compozerComponentTmpRow = new Compozer();
    this.stringCompozerObject = JSON.stringify(this.compozerObject, null, 2);
  }

  public addCompozerComponent(): void {
    switch (this.tmpComponent.compozerType) {
      case 'content': {
        this.tmpNewRow.push({
          compozerType: 'content',
          materializeWidth: this.tmpComponent.columns,
          value: this.tmpComponent.value
        });
        break;
      }
      case 'question': {
        this.tmpNewRow.push({
          compozerType: 'question',
          type: 'textbox',
          materializeWidth: this.tmpComponent.columns,
          key: 'azeaze',
          label: this.tmpComponent.value
        });
        break;
      }
      case 'html': {
        this.tmpNewRow.push({
          compozerType: 'html',
          materializeWidth: this.tmpComponent.columns,
          value: this.tmpComponent.value
        });
        break;
      }
    }

    this.compozerComponentTmpRow = new Compozer([this.tmpNewRow]);

    this.tmpComponent.value = null;
    this.tmpComponent.compozerType = null;
    this.tmpComponent.columns = null; // TODO déduire la somme des composants existants de 12
  }

  public addRow(): void {
    this.compozerObject.push(this.tmpNewRow);
    this.compozerComponent = new Compozer(this.compozerObject);
    this.stringCompozerObject = JSON.stringify(this.compozerObject, null, 2);
    this.child.prepareForm();
  }

  public updatestringCompozerObject (): void {
    try {
      this.compozerComponent = new Compozer(JSON.parse(this.stringCompozerObject));
      this._notificationsService.success('Formulaire mis à jour', 'Succès'); // TODO translate
    } catch (e) {
      console.error(e);
      this._notificationsService.error('Erreur', 'Mauvais format'); // TODO translate
    }
  }
}
