import {Component, OnInit, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {TranslateService, initTranslation} from './i18n/i18n';
import {ActivatedRoute, Router} from '@angular/router';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {NotificationsService} from 'angular2-notifications';
import {ComponentCanDeactivate} from '../../../../pending-changes-guard.service';
import {Observable} from 'rxjs/Observable';
import {InputListComponent} from '../../../../directives/input-list/input-list.component';

//import { Clearbit } from '../../../../models/clearbit';

import {Ng2FileDropAcceptedFile, Ng2FileDropRejectedFile} from 'ng2-file-drop';

import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";

// TODO : Optimisation : Ne pas envoyer tout l'objet Innovation à chaque mise à jour. Retenir la version sauvegardée et n'envoyer que la différence.

@Component({
  selector: 'app-client-project-edit',
  templateUrl: './client-project-edit.component.html',
  styleUrls: ['./client-project-edit.component.scss']
})
export class ClientProjectEditComponent implements OnInit, ComponentCanDeactivate {

  private _project: any;

  private _autoSave: {
    timeout: any,
    isSaving: boolean,
    newSaveRequired: boolean,
    data: any
  } = {
    timeout: null,
    isSaving: false,
    newSaveRequired: false,
    data: null
  };

  public formData: FormGroup;

  buildForm(): void {
    this.formData = this._formBuilder.group({
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
          countriesToExclude: this._formBuilder.group({
            exclude: [[]]
          }),
          tmpNewCountryToExclude: ['']
        }),
        market: this._formBuilder.group({
          comments: ['']
        }),
        companies: this._formBuilder.group({
          exclude: [[]],
          description: ['']
        }),
        professionals: this._formBuilder.group({
          exclude: [[]],
          examples: [[]],
          description: ['']
        }),
        comments: ['']
      }),
      patented: [undefined, Validators.required],
      projectStatus: [undefined, Validators.required],
      innovationCards: this._formBuilder.array([]),
      dirty: ['']
    });
  }

  /*
   * Gestion de l'affichage :
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)
  public displayCountriesToExcludeSection = false;
  public displayCompanyToExcludeSection = false;
  public displayPersonsToExcludeSection = false;
  public draggingPhoto = false;

  public supportedFileTypes: string[] = ['image/png', 'image/jpeg', 'image/gif'];

  constructor(private _activatedRoute: ActivatedRoute,
              private _innovationService: InnovationService,
              private _translateService: TranslateService,
              private _router: Router,
              private _notificationsService: NotificationsService,
              private _formBuilder: FormBuilder) {}

  ngOnInit() {
    initTranslation(this._translateService);

    this.buildForm();

    this._activatedRoute.params.subscribe(params => {
      const innovationId = params['innovationId'];

      this._innovationService.get(innovationId).subscribe(innovation => {
          this._project = innovation;
          // delete innovation._id;
          this.formData.patchValue(innovation);

          if (!this.canEdit) {
            this.formData.disable();
          }
          for (const innovationCard of innovation.innovationCards) {
            this._addInnovationCardWithData(innovationCard);
          }

          this.formData.valueChanges
            .debounceTime(20000) //This is the time in ms that the form waits before emitting the valueChanges event
            .distinctUntilChanged()
            .subscribe((newVersion) => {
              this._autoSave.data = newVersion;
              this._save();
              this._autoSave.newSaveRequired = true;
          });
        },
        errorTranslateCode => {
          this._translateService.get(errorTranslateCode).subscribe(errorMessage =>
            this._notificationsService.error('Error', errorMessage) // TODO Translate Error
          );
          this._router.navigate(['/projects']);
        }
      );
    });
  }

  private _save() {
    if (this.canEdit && !this._autoSave.isSaving) {
      console.log("Start saving");
      this._autoSave.isSaving = true;
      this._innovationService.save(this._project.id, this._autoSave.data, this._project.innovationCards[0].id).subscribe(data => {
        this._autoSave.isSaving = false;
        console.log("End saving");
        if (this._autoSave.newSaveRequired) {
          this._autoSave.newSaveRequired = false;
          this._save();
        }
      });
    }
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
    if (this.canEdit) {
      const worldCheckboxValue = $event.target.checked;
      for (const o in this.formData.get('settings').get('geography').get('continentTarget').value) {
        if (typeof this.formData.get('settings').get('geography').get('continentTarget').get(o) !== 'undefined') {
          this.formData.get('settings').get('geography').get('continentTarget').get(o).setValue(worldCheckboxValue);
        }
      }
    }
  }

  public clickOnContinent(continent): void {
    if (this.canEdit) {
      continent = this.formData.get('settings').get('geography').get('continentTarget').get(continent);
      continent.setValue(!continent.value);
    }
  }

  public getContinentSelectionStatus(continent): boolean {
    return !!this.formData.get('settings').get('geography').get('continentTarget').get(continent).value;
  }

  /**
   * Expands the list of countries. If there's at least one country, it is expanded by default
   * @returns {boolean}
   */
  public excludedCountriesListExpanded(): boolean {
    return this.displayCountriesToExcludeSection ||
      this.formData.get('settings').get('geography').get('countriesToExclude').get('exclude').value.length;
  }

  /**
   * Add a country to the exclusion list
   */
  public addCountryToExclude(event): void {
    this.formData.get('settings').get('geography')
      .get('countriesToExclude').get('exclude').setValue(event.value);
  }

  /**
   * Add a company to exclude
   * @param event
   */
  public addCompanyToExclude(event): void {
    this.formData.get('settings').get('companies')
      .get('exclude').setValue(event.value);
  }

  /**
   * Add people to exclude
   * @param event
   */
  public addPeopleToExclude(event): void {
    this.formData.get('settings').get('professionals')
      .get('exclude').setValue(event.value);
  }

  /**
   * This configuration tells the directive what text to use for the placeholder and if it exists,
   * the initial data to show.
   * @param type
   * @returns {any|{placeholder: string, initialData: string}}
   */
  public getConfig(type: string): any {
    const _inputConfig = {
      'advantages': {
        placeholder: 'PROJECT_EDIT.DESCRIPTION.ADVANTAGES.INPUT',
        initialData: []
      },
      'excludedPeople': {
        placeholder: 'PROJECT_EDIT.PROFESSIONALS.TO_EXCLUDE',
        initialData: this.formData.get('settings')
          .get('professionals').get('exclude').value
      },
      'excludedCompanies': {
        placeholder: 'PROJECT_EDIT.COMPANIES.TO_EXCLUDE',
        initialData: this.formData.get('settings')
          .get('companies').get('exclude').value
      },
      'excludedCountries': {
        placeholder: 'PROJECT_EDIT.TARGETING.NEW_COUNTRY_TO_EXCLUDE_PLACEHOLDER',
        initialData: this.formData.get('settings').get('geography')
          .get('countriesToExclude').get('exclude').value
      }
    };
    return _inputConfig[type] || {
      placeholder: 'Input',
      initialData: ''
    };
  }

  private _newInnovationCardFormBuilderGroup (data) {
    return this._formBuilder.group({
      id: [data.id, Validators.required],
      title: [data.title, Validators.required],
      summary: [data.summary, Validators.required],
      problem: [data.problem, Validators.required],
      solution: [data.solution, Validators.required],
      advantages: [[]],
      lang: [data.lang, Validators.required],
      principal: [data.principal, Validators.required],
      media: [data.media, Validators.required]
    });
  }

  public createInnovationCard() {
    if (this.canEdit) {
      if (this._project.innovationCards.length < 2 && this._project.innovationCards.length !== 0) {
        this._innovationService.createInnovationCard(this._project.id, {
          lang: this._project.innovationCards[0].lang === 'en' ? 'fr' : 'en' // Pour l'instant il n'y a que deux langues
        }).subscribe((data) => {
          this._addInnovationCardWithData(data);
          this._project.innovationCards.push(data);
        });
      }
    }
  }

  private _addInnovationCardWithData(innovationCardData): void {
    const innovationCards = this.formData.controls['innovationCards'] as FormArray;
    innovationCards.push(this._newInnovationCardFormBuilderGroup(innovationCardData));
  }

  /**
   * Add an advantage to the invention card
   * @param event the resulting value sent from the component directive
   * @param cardIdx this is the index of the innovation card being edited.
   */
  public addAdvantageToInventionCard (event, cardIdx) {
    let card = this.formData.get('innovationCards').value[cardIdx] as FormGroup;
    card['advantages'].push(event.value);
    this.formData.get('dirty').setValue(Date.now());
  }

  public setAsPrincipal (innovationCardId) {
    const innovationCards = this.formData.get('innovationCards').value;
    for (const innovationCard of innovationCards) {
      innovationCard.principal = innovationCard.id === innovationCardId;
    }
    this.formData.get('innovationCards').setValue(innovationCards);
  }

  public submitProjectToValidation () {
    this._innovationService.submitProjectToValidation(this._project.id).subscribe(data => {
      this._project.status = data.status;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !(this._autoSave.isSaving || this._autoSave.newSaveRequired);
  }

  // TODO ajouter pour IE éventuellement, à tester
  // @ HostListener allows us to also guard against browser refresh, close, etc.
  /*@ HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = "This message is displayed to the user in IE and Edge when they navigate without using Angular routing (type another URL/close the browser/etc)";
    }
  }*/

  public dragFileAccepted(acceptedFile: Ng2FileDropAcceptedFile) {
    console.log(acceptedFile);
  }

  public dragFileRejected(rejectedFile: Ng2FileDropRejectedFile) {
    console.log(rejectedFile);
  }

  public dragFilesDropped(event) {
    console.log(event);
  }

  get canEdit () {
    return this._project.status === 'EDITING';
  }

  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get project(): any { return this._project; }
}
