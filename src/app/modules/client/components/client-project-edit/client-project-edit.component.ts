import {Component, OnInit, Input} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IndexService} from '../../../../services/index/index.service';
import {TranslateService, initTranslation} from './i18n/i18n';
import {ActivatedRoute} from '@angular/router';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-client-project-edit',
  templateUrl: './client-project-edit.component.html',
  styleUrls: ['./client-project-edit.component.scss']
})
export class ClientProjectEditComponent implements OnInit {

  private _project: any;

  private innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)

  private _autoSave: {
    timeout: any,
    isSaving: boolean, // TODO
    newSaveRequired: boolean,
    data: any
  } = {
    timeout: null,
    isSaving: false,
    newSaveRequired: false,
    data: null
  };

  public formData: FormGroup = this._formBuilder.group({
    settings: this._formBuilder.group({
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
        countriesToExclude: this._formBuilder.array([]),
        tmpNewCompanyToExclude: ['']
      }),
      market: this._formBuilder.group({
        comments: ['']
      }),
      companies: this._formBuilder.group({
        exclude: [[]],
        description: ['']
      }),
      professionals: this._formBuilder.group({
        examples: [[]],
        description: ['']
      }),
      comments: ['']
    }),
    patented: [undefined, Validators.required],
    projectStatus: [undefined, Validators.required],
    innovationCards: this._formBuilder.array([])
  });

  public displayCountriesToExcludeSection = false;
  public displayCompanyToExcludeSection = false;
  public displayPersonsToExcludeSection = false;

  constructor(private _indexService: IndexService,
              private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _notificationsService: NotificationsService,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    initTranslation(this._translateService);

    this._activatedRoute.params.subscribe(params => {
      const innovationId = params['innovationId'];

      this._innovationService.get(innovationId).subscribe(innovation => {
          this._project = innovation;
          if (!innovation.settings) { // TODO
            innovation.settings = {};
          }
          if (!innovation.innovationCard) { // TODO
            innovation.innovationCard = {};
          }
          delete innovation._id;
          this.formData.patchValue(innovation);
          for (const innovationCard of innovation.innovationCards) {
            this.addInnovationCard(innovationCard);
          }
          // displayCountriesToExcludeSection = innovation..length > 0;

          this.formData.valueChanges.subscribe((newVersion) => {
            this._autoSave.data = newVersion;
            if (this._autoSave.isSaving) {
              this._autoSave.newSaveRequired = true;
            }
            else {
              if (typeof this._autoSave !== 'undefined') {
                clearTimeout(this._autoSave.timeout);
              }
              this._autoSave.timeout = setTimeout(_ => this._save(), 700);
            }
          });
        },
        error => this._notificationsService.error('Error', error.message)
      );
    });

    /*this._indexService.getCountriesForAutoComplete().subscribe((countries) => {
     this.countries = countries;
     });*/
  }

  private _save() {
    this._autoSave.isSaving = true;
    this._innovationService.save(this._project.id, this._autoSave.data, this._project.innovationCards[0].id).subscribe(data => {
      this._autoSave.isSaving = false;
      if (this._autoSave.newSaveRequired) {
        this._autoSave.newSaveRequired = false;
        this._save();
      }
    });
  }

  public addCountryToExclude() {
    const tmpValue = this.formData.get('settings').get('geography').get('tmpNewCompanyToExclude');
    this.countriesToExclude.push(this._formBuilder.control(tmpValue.value));
    tmpValue.setValue('');
  }

  public areAllContinentChecked(): boolean {
    for (const o in this.formData.get('settings').get('geography').get('continentTarget').value) {
      if (!this.formData.get('settings').get('geography').get('continentTarget').get(o).value) {
        return false;
      }
    }
    return true;
  }

  public switchWorldCheckbox($event): void {
    const worldCheckboxValue = $event.target.checked;
    for (const o in this.formData.get('settings').get('geography').get('continentTarget').value) {
      if (typeof this.formData.get('settings').get('geography').get('continentTarget').get(o) !== 'undefined') {
        this.formData.get('settings').get('geography').get('continentTarget').get(o).setValue(worldCheckboxValue);
      }
    }
  }

  public clickOnContinent(continent): void {
    continent = this.formData.get('settings').get('geography').get('continentTarget').get(continent);
    continent.setValue(!continent.value);
  }

  public getContinentSelectionStatus(continent): boolean {
    return !!this.formData.get('settings').get('geography').get('continentTarget').get(continent).value;
  }

  public createInnovationCard() {
    // TODO
    if (this._project.innovationCards.length < 2 && this._project.innovationCards.length !== 0) {
      this._innovationService.createInnovationCard(this._project.id, {
        lang: this._project.innovationCards[0].lang === 'en' ? 'fr' : 'en'
      }).subscribe((data) => {
        this.addInnovationCard(data);
      });
    }
  }

  public addAdvantage () {
    // TODO
    // this.formData.get('innovationCards')[this.innovationCardEditingIndex].get('');
    alert('add advantage');
  }

  public setAsPrincipal (innovationCardId) {
    alert('TODO'); // TODO
  }

  public addInnovationCard(innovationCardData): void {
    const innovationCards = this.formData.controls['innovationCards'] as FormArray;
    const innovationCard = this._formBuilder.group(innovationCardData);
    innovationCards.push(innovationCard);
  }

  get dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
  }

  get project() {
    return this._project;
  }

  get countriesToExclude(): FormArray {
    return this.formData.get('settings').get('geography').get('countriesToExclude') as FormArray;
  }
}
