import { Component, OnInit } from '@angular/core';
import {EnterpriseService} from "../../../../../../services/enterprise/enterprise.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SidebarInterface} from "../../../../../sidebars/interfaces/sidebar-interface";
import {Enterprise} from "../../../../../../models/enterprise";
import {Observable} from "rxjs";
import {Clearbit} from "../../../../../../models/clearbit";
import {AutocompleteService} from "../../../../../../services/autocomplete/autocomplete.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";


@Component({
  selector: 'app-admin-enterprise-management',
  templateUrl: './admin-enterprise-management.component.html',
  styleUrls: ['./admin-enterprise-management.component.scss']
})
export class AdminEnterpriseManagementComponent implements OnInit {

  private _defaultLogoURI = 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png';

  private _searchForm: FormGroup;
  private _newEnterpriseForm: FormGroup;

  private _newEnterprise: Enterprise;
  private _displayLoading: boolean = false;
  private _sidebarValue: SidebarInterface = {};
  private _uploadLogoModal: boolean = false;

  private _results: Array<any> = [];

  constructor(private _enterpriseService: EnterpriseService,
              private _formBuilder: FormBuilder,
              private _autoCompleteService: AutocompleteService,
              private _sanitizer: DomSanitizer,) {
  }

  private _buildForm() {
    // Search form
    this._searchForm = this._formBuilder.group( {
      searchString: [''],
    });

    // New company form
    /*
    logo: {
        uri: {
          type: String,
          default: 'https://res.cloudinary.com/umi/image/upload/app/companies-logo/no-image.png' //TODO put here a generic logo
        },
        alt: {
          type: String,
          default: 'Company name'
        },
        id: {
          type: String,
          default: ''
        }
      }
     */
    this._newEnterpriseForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      topLevelDomain: [null, [Validators.required]],
      enterpriseURL: [null],
      logo: [null],
      subsidiaries: [null],
      parentEnterprise: [null],
      patterns: [null],
      enterpriseType: [null],
      industries: [null],
      brands: [null],
      geographicalZone: [null]
    });
  }


  ngOnInit(): void {
    this._buildForm();
  }

  public doSearch() {
    this._displayLoading = true;
    this._enterpriseService.get()
      .subscribe( (result:any) => {
        console.log(result);
        this._displayLoading = false;
      }, (err: any)=> {
        console.error(err);
        this._displayLoading = false;
      });
  }

  public createEnterpriseSidebar(event: Event) {
    console.log("Let's open the sidebar");
    this._sidebarValue = {
      animate_state: 'active',
      title: 'Add a new enterprise',
      type: 'enterprise'
    }
  }

  public createEnterprise() {
    this._newEnterprise = {
      name: this._newEnterpriseForm.get('name').value,
      topLevelDomain: this._newEnterpriseForm.get('topLevelDomain').value,
    };
    Object.keys(this._newEnterpriseForm.controls).forEach(key => {
      if(this._newEnterpriseForm.get(key).value) {
        switch(key) {
          case 'patterns':
            if(!this._newEnterprise.patterns) {
              this._newEnterprise.patterns = [];
            }
            this._newEnterprise.patterns.push({pattern: {expression:this._newEnterpriseForm.get(key).value}});
            break;
          case 'name':
          case 'topLevelDomain':
            //NOOP
            break;
          case 'logo':
            this._newEnterprise[key] = {
              'uri': this._newEnterpriseForm.get('logo').value || this._defaultLogoURI,
              'alt': this._newEnterpriseForm.get('name').value
            };
            break;
          default:
            this._newEnterprise[key] = this._newEnterpriseForm.get(key).value;
        }
      }
    });
    this._enterpriseService.create(this._newEnterprise)
      .subscribe(result => {
        console.log(result);
      }, err=> {
        console.error(err);
      });
  }

  public companiesSuggestions = (searchString: string): Observable<Array<{name: string, domain: string, logo: string}>> => {
    return this._autoCompleteService.get({query: searchString, type: 'company'});
  };

  public selectCompany(c: string | Clearbit) {
    if(typeof c === 'object') {
      // Maybe there's a logo...
      this._newEnterpriseForm.get('name').reset(c.name);
      this._newEnterpriseForm.get('topLevelDomain').reset(c.domain);
      this._newEnterpriseForm.get('logo').reset(c.logo);
    } // If typeof c === string, leave the thing alone.
  }

  public autocompleteCompanyListFormatter = (data: any): SafeHtml => {
    return this._sanitizer.bypassSecurityTrustHtml(`<img style="vertical-align:middle;" src="${data.logo}" height="35" alt=" "/><span>${data.name}</span>`);
  };

  public newPattern(event: Event) {
    event.preventDefault();
    this.patterns.push(new FormGroup({ pattern: new FormControl('') }));
  }

  public changeLogo(event: Event) {
    event.preventDefault();
    this._uploadLogoModal = true;
    console.log("Change the logo");
  }

  public removePattern(event: Event, index: number) {
    event.preventDefault();
    this.patterns.removeAt(index);
  }

  public uploadImage(event: Event) {
    console.log(event);
  }

  get logoUploadUri(): string {

    //'/innovation/'+innovation._id+'/innovationCard/'+innovationCard._id+'/media/image'
    return `/enterprise....`;
  }

  get results(): Array<any> {
    return this._results;
  }

  get searchForm(): FormGroup {
    return this._searchForm;
  }

  get newEnterpriseForm(): FormGroup {
    return this._newEnterpriseForm;
  }

  get displayLoading(): boolean {
    return this._displayLoading;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get patterns(): FormArray {
    return this._newEnterpriseForm.get('patterns') as FormArray;
  }

  get logoUrl(): string {
    return this._newEnterpriseForm.get('logo').value || this._defaultLogoURI;
  }

  get uploadLogoModal(): boolean {
    return this._uploadLogoModal;
  }

  set uploadLogoModal(value: boolean) {
    this._uploadLogoModal = value;
  }

}
