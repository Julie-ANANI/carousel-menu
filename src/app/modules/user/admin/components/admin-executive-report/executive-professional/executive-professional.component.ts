import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
// import { first } from 'rxjs/operators';
// import { HttpErrorResponse } from '@angular/common/http';
import { ExecutiveProfessional } from '../../../../../../models/executive-report';
// import { ProfessionalsService } from '../../../../../../services/professionals/professionals.service';
import { CommonService } from '../../../../../../services/common/common.service';
import { SnippetService } from '../../../../../../services/snippet/snippet.service';
import { ExecutiveReportFrontService } from '../../../../../../services/executive-report/executive-report-front.service';

interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  jobTitle: string;
}

@Component({
  selector: 'app-admin-executive-professional',
  templateUrl: './executive-professional.component.html',
  styleUrls: ['./executive-professional.component.scss']
})

export class ExecutiveProfessionalComponent implements OnInit {

  @Input() lang = 'en';

  @Input() set config(value: ExecutiveProfessional) {
    this._config = value;
  }

  @Output() configChange: EventEmitter<ExecutiveProfessional> = new EventEmitter<ExecutiveProfessional>();

  private _config: ExecutiveProfessional = <ExecutiveProfessional>{
    abstract: '',
    list: []
  };

  private _professionalAbstractColor = '';

  private _allProfessionals: Array<Professional> = [];

  private _top4Pro: Array<Professional> = [<Professional>{}, <Professional>{}, <Professional>{}, <Professional>{}];

  private _restPro: Array<Professional> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _executiveReportFrontService: ExecutiveReportFrontService,
              /*private _professionalsService: ProfessionalsService*/) { }

  ngOnInit(): void {
    this._populateProfessionals();
    this.textColor();
  }

  private _populateProfessionals() {
    if (isPlatformBrowser(this._platformId)) {
      // Populate should happen in the back! not in the front
      // Here we should just do the slicing and sorting if needed
      this._allProfessionals = <Array<Professional>><unknown>this._config.list;
      this._top4Pro = this._allProfessionals.slice(0, 4);
      this._populateRestPro();
      console.log(this._allProfessionals);
      /*const config = {
        fields: '_id firstName lastName jobTitle company country',
        _id: JSON.stringify({ $in: this._config.list })
      };
      this._professionalsService.getAll(config).pipe(first()).subscribe((response) => {
        this._allProfessionals = response && response.result || [];

        if (this._allProfessionals.length >= 4) {
          const pros: Array<Professional> = [];

          this._config.list.forEach((id) => {
            const index = this._allProfessionals.findIndex((pro) => pro._id === id);
            if (index !== -1) {
              pros.push(this._allProfessionals[index]);
            }
          });

          this._top4Pro = pros.slice(0, 4);

        } else {
          for (let i = 0; i <= this._allProfessionals.length; i++) {
            if (this._allProfessionals[i]) {
              this._top4Pro[i] = this._allProfessionals[i];
            } else {
              this._top4Pro[i] = <Professional>{};
            }
          }
        }

        this._populateRestPro();
        this._allProfessionals = ExecutiveProfessionalComponent._sortPro(this._allProfessionals);
        }, (err: HttpErrorResponse) => {
          console.error(err);
        });*/
    }
  }

  private static _sortPro(proList: Array<Professional>) {
    if (proList.length > 0) {
      return proList.sort((a, b) => {
        const nameA = (a.firstName + a.lastName).toLowerCase();
        const nameB =  (b.firstName + b.lastName).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      return []
    }
  }

  private _populateRestPro() {
    this._restPro = ExecutiveProfessionalComponent._sortPro(this._allProfessionals.filter((pro) => {
      const index = this._top4Pro.findIndex((value) => value._id === pro._id);
      if (index === -1) {
        return true;
      }
    }));
  }

  public textColor() {
    this._professionalAbstractColor = CommonService.getLimitColor(this._config.abstract.length, 258);
  }

  public onClickPlay(event: Event) {
    event.preventDefault();
    this._executiveReportFrontService.audio(this._config.abstract, this.lang);
  }

  public onClickSnippet(event: Event) {
    event.preventDefault();
    this._config.abstract = SnippetService.storyboard('PROFESSIONAL', this.lang);
    this.textColor();
    this.emitChanges();
  }

  public emitChanges() {
    this.configChange.emit(this._config);
  }

  public selectPro(event: Event, index: number) {
    this._top4Pro[index] = this._getPro(event && event.target && (event.target as HTMLSelectElement).value);
    this._populateRestPro();

    this._config.list = this._top4Pro.concat(this._restPro).map((value) => {
      return value._id;
    });

    this.emitChanges();
  }

  private _getPro(id: string): Professional {
    const index = this._allProfessionals.findIndex((pro) => pro._id === id);
    if (index !== -1) {
      return this._allProfessionals[index];
    }
  }

  get config(): ExecutiveProfessional {
    return this._config;
  }

  get professionalAbstractColor(): string {
    return this._professionalAbstractColor;
  }

  get top4Pro(): Array<Professional> {
    return this._top4Pro;
  }

  get restPro(): Array<Professional> {
    return this._restPro;
  }

}
