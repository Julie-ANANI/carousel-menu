import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-admin-community-search',
  templateUrl: './admin-community-search.component.html',
  styleUrls: ['./admin-community-search.component.scss']
})

//FormsModule

export class AdminCommunitySearchComponent implements OnInit {

  private _config: any;

  private _advSearchForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this._advSearchForm = this._formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this._config = {
      fields: 'language firstName lastName company country jobTitle campaigns tags messages',
      limit: '10',
      offset: '0',
      search: '{"ambassador.is":true}',
      sort: '{"created":-1}'
    };
  }

  public search() {
    console.log("GO search!");
  }

  get config() {
    return this._config;
  }

  get advSearchForm(): FormGroup {
    return this._advSearchForm;
  }
}