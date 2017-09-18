import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { IndexService } from '../../../../services/index/index.service';

@Component({
  selector: 'app-client-innovation-settings',
  templateUrl: './client-innovation-settings.component.html',
  styleUrls: ['./client-innovation-settings.component.styl']
})
export class ClientInnovationSettingsComponent implements OnInit {

  @Input() innovation: any;
  @Input() innovationCard: any;

  public tmpInnovationSettings = {
    geography: {
      countriesToExclude: ''
    },
    companies: {
      include: '',
      exclude: ''
    },
    market: {
      sectors: ''
    },
    keywords: ''
  };

  public autocomplete = { // TODO
    countries: {
      'France': null,
      'United States of America': null
    },
    marketSectors: {
      'Photographie': null
    }
  };

  public countries: object;

  public settings: FormGroup;

  constructor(private _indexService: IndexService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.settings = this._formBuilder.group({
      data1: ['', [Validators.required]],
      account: this._formBuilder.group({
        email: ['', Validators.required],
        confirm: ['', Validators.required]
      }),
      numbers: this._formBuilder.array([new FormControl()])
    });


    this.settings.valueChanges.subscribe(({ value, valid }: { value: any, valid: boolean }) => {
      console.log('Form changes', value, valid);
    });

    this._indexService.getCountriesForAutoComplete().subscribe((countries) => {
      this.countries = countries;
    });
  }

  public addNumber() {
    const control = <FormArray>this.settings.controls['numbers'];
    control.push(new FormControl())
  }

  public onSubmit({ value, valid }: { value: any, valid: boolean }) {
    console.log(value, valid);
  }

  private _areAllGeographicCheckboxesChecked () {
    for (const o in this.innovation.settings.geography.continentTarget) {
      if (o !== 'world' && !this.innovation.settings.geography.continentTarget[o]) {
        return false;
      }
    }
    return true;
  }

  onCheckboxValueChange (event) {
    if (event.target.name === 'world') {
      for (const i in this.innovation.settings.geography.continentTarget) {
        if (typeof this.innovation.settings.geography.continentTarget[i] !== 'undefined') {
          this.innovation.settings.geography.continentTarget[i] = this.innovation.settings.geography.continentTarget.world;
        }
      }
    }
    else if (this.innovation.settings.geography.continentTarget.world) {
      this.innovation.settings.geography.continentTarget.world = this._areAllGeographicCheckboxesChecked();
    }
    else if (this._areAllGeographicCheckboxesChecked()) {
      this.innovation.settings.geography.continentTarget.world = true;
    }
  }

  /*private _getObjectItemValuebyString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    const a = s.split('.');
    for (let i = 0, n = a.length; i < n; ++i) {
      const k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  };*/

  public addItemToArray (array, tmpVariable) {
    if (!array.includes(tmpVariable)
      && tmpVariable !== ''
      /*&& (
        typeof this.autocomplete[tmpVariableName] === 'undefined'
        || this.autocomplete[tmpVariableName].hasOwnProperty(tmpVariable)
      )*/) {
      array.push(tmpVariable);
      tmpVariable = '';
    }
  }

  public removeItemFromArray (array, item) {
    let index = array.indexOf(item);
    while (index >= 0) {
      array.splice(index, 1);
      index = array.indexOf(item);
    }
  }
}
