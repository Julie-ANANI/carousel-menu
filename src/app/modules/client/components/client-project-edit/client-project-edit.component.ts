import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexService } from '../../../../services/index/index.service';
import { TranslateService , initTranslation} from './i18n/i18n';
import { ActivatedRoute } from '@angular/router';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-client-project-edit',
  templateUrl: './client-project-edit.component.html',
  styleUrls: ['./client-project-edit.component.scss']
})
export class ClientProjectEditComponent implements OnInit {

  private _project: any;

  private _autoSave: {
    timeout: any,
    isSaving: boolean // TODO
  } = {
    timeout: null,
    isSaving: false
  };

  public formData: FormGroup = this._formBuilder.group({
    geography: this._formBuilder.group({
      continentTarget: this._formBuilder.group({
        europe: [false, [Validators.required]],
        africa: [false, [Validators.required]],
        asia: [false, [Validators.required]],
        oceania: [false, [Validators.required]],
        russia: [false, [Validators.required]],
        americaNord: [false, [Validators.required]],
        americaSud: [false, [Validators.required]]
      }),
      countriesToExclude: [[]],
      comments: ['']
    }),
    market: this._formBuilder.group({
      sectors: [[]],
      comments: ['']
    }),
    companies: this._formBuilder.group({
      include: [[]],
      exclude: [[]],
      description: ['']
    }),
    professionals: this._formBuilder.group({
      examples: [''],
      description: ['']
    }),
    keywords: [[]],
    comments: ['']
  });

  constructor(private _indexService: IndexService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    initTranslation(this._translateService);

    this._activatedRoute.params.subscribe(params => {
      const innovationId = params['innovationId'];

      this._innovationService.get(innovationId).subscribe(innovation => {
          this._project = innovation;
        },
        error => this._notificationsService.error('Error', error.message)
      );

    });

    this.formData.valueChanges.subscribe((newVersion) => {
      if (typeof this._autoSave !== 'undefined') {
        clearTimeout(this._autoSave.timeout);
      }
      this._autoSave.timeout = setTimeout(_ => this._save(newVersion), 2000);
    });

    /*this._indexService.getCountriesForAutoComplete().subscribe((countries) => {
     this.countries = countries;
     });*/
  }

  private _save (newData) {
    console.log('UPDATE ', newData); // TODO
  }

  /*public onSubmit({value, valid}: { value: any, valid: boolean }) {
    if (valid) {
      this._save(value);
    }
    else {
      alert('not valid');
    }
  }*/

  public areAllContinentChecked(): boolean {
    for (const o in this.formData.get('geography').get('continentTarget').value) {
      if (!this.formData.get('geography').get('continentTarget').get(o).value) {
        return false;
      }
    }
    return true;
  }

  public switchWorldCheckbox($event): void {
    const worldCheckboxValue = $event.target.checked;
    for (const o in this.formData.get('geography').get('continentTarget').value) {
      if (typeof this.formData.get('geography').get('continentTarget').get(o) !== 'undefined') {
        this.formData.get('geography').get('continentTarget').get(o).setValue(worldCheckboxValue);
      }
    }
  }

  public clickOnContinent(continent): void {
    continent = this.formData.get('geography').get('continentTarget').get(continent);
    continent.setValue(!continent.value);
  }

  public createInnovationCard() {
    // TODO
    alert('Creation d\'une innovationCard');
  }

  public getContinentSelectionStatus(continent): boolean {
    return !!this.formData.get('geography').get('continentTarget').get(continent).value;
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get project() {
    return this._project;
  }
}
