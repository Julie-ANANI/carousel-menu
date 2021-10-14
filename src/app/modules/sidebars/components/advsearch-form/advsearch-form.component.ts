import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AdvSearchService } from '../../../../services/advsearch/advsearch.service';
import {emailRegEx} from '../../../../utils/regex';

@Component({
  selector: 'advsearch-form',
  templateUrl: './advsearch-form.component.html',
  styleUrls: ['./advsearch-form.component.scss'],
})
export class AdvsearchFormComponent implements OnInit {
  private _advSearchForm: FormGroup;

  @Input() set sidebarState(value: string) {
    if (value === undefined || 'active') {
      this.buildForm();
      this._advSearchForm.reset();
    }
  }

  @Output() finalOutput = new EventEmitter<FormGroup>();

  constructor(
    private _formBuilder: FormBuilder,
    private _advsearchService: AdvSearchService
  ) {}

  ngOnInit() {}

  private buildForm() {
    this._advSearchForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailRegEx)]],
      companyName: [''],
      jobTitle: [''],
      country: [''],
    });
    this._advSearchForm
      .get('firstName')
      .valueChanges.pipe(debounceTime(100))
      .subscribe((event) => {
        this.processOneLine(this, event);
      });
  }

  private processOneLine(self: AdvsearchFormComponent, oneString: string) {
    // If we can split the given string using tabs, we can fill the all the other fields in one go.
    if (oneString) {
      const multipleString = oneString.split('\t');
      if (multipleString.length > 1) {
        Object.keys(self._advSearchForm.controls).forEach((key, idx) => {
          self._advSearchForm
            .get(key)
            .setValue(multipleString[idx], { emitEvent: false });
        });
      } else {
        self._advSearchForm
          .get('firstName')
          .setValue(multipleString[0], { emitEvent: false });
      }
    }
  }

  public search() {
    this._advsearchService.advsearch(this._advSearchForm.value).subscribe(
      (result) => {
        this.finalOutput.emit(result);
        console.log(result);
      },
      (error) => {
        console.error(error);
        this.finalOutput.emit(null);
      },
      () => {
        console.log('DONE!');
      }
    );
  }

  get advSearchForm(): FormGroup {
    return this._advSearchForm;
  }
}
