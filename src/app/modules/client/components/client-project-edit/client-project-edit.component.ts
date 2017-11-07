import {Component, OnInit, HostListener} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService, initTranslation} from './i18n/i18n';
import {ActivatedRoute} from '@angular/router';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {NotificationsService} from 'angular2-notifications';
import {ComponentCanDeactivate} from '../../../../pending-changes-guard.service';
import {Observable} from 'rxjs/Observable';

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


  /*
   * Gestion de l'affichage :
   */
  public innovationCardEditingIndex = 0; // Index de l'innovationCard que l'on édite (système d'onglets)
  public displayCountriesToExcludeSection = false;
  public displayCompanyToExcludeSection = false;
  public displayPersonsToExcludeSection = false;

  constructor(private _activatedRoute: ActivatedRoute,
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
          // delete innovation._id;
          this.formData.patchValue(innovation);
          if (!this.canEdit) {
            this.formData.disable();
          }
          for (const innovationCard of innovation.innovationCards) {
            this._addInnovationCardWithData(innovationCard);
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
  }

  private _save() {
    if (this.canEdit) {
      this._autoSave.isSaving = true;
      this._innovationService.save(this._project.id, this._autoSave.data, this._project.innovationCards[0].id).subscribe(data => {
        this._autoSave.isSaving = false;
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
        });
      }
    }
  }

  private _addInnovationCardWithData(innovationCardData): void {
    const innovationCards = this.formData.controls['innovationCards'] as FormArray;
    innovationCards.push(this._newInnovationCardFormBuilderGroup(innovationCardData));
  }

  public addAdvantageToInventionCard () {
    // TODO
    // this.formData.get('innovationCards')[this.innovationCardEditingIndex].get('');
    alert('add advantage');
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
    return !this._autoSave.isSaving && !this._autoSave.newSaveRequired;
  }

  // TODO ajouter pour IE éventuellement, à tester
  // @ HostListener allows us to also guard against browser refresh, close, etc.
  /*@ HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = "This message is displayed to the user in IE and Edge when they navigate without using Angular routing (type another URL/close the browser/etc)";
    }
  }*/

  get canEdit () {
    return this._project.status === 'EDITING';
  }

  get disable () {
    return this.canEdit ? 'enable' : 'disable';
  }

  get dateFormat(): string { return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd'; }
  get project(): any { return this._project; }
}
