import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AdvSearchService } from "../../../../services/advsearch/advsearch.service";

@Component({
  selector: 'advsearch-form',
  templateUrl: './advsearch-form.component.html',
  styleUrls: ['./advsearch-form.component.scss']
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


  constructor(private _formBuilder: FormBuilder,
              private _advsearchService: AdvSearchService) { }

  ngOnInit() {
  }


  private buildForm() {
    this._advSearchForm = this._formBuilder.group( {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      companyName: [''],
      jobTitle: [''],
      country: ['']
    });
    this._advSearchForm.get('firstName')
      .valueChanges.pipe(debounceTime(100))
      .subscribe(event=>{
        this.processOneLine(this, event);
      });
  }

  private processOneLine(self, oneString) {
    //If we can split the given string using tabs, we can fill the all the other fields in one go.
    if(oneString) {
      oneString = oneString.split('\t');
      if(oneString.length > 1 ) {
        Object.keys(self._advSearchForm.controls).forEach((key, idx)=>{
          self._advSearchForm.get(key).setValue(oneString[idx], {emitEvent:false});
        });
      } else {
        self._advSearchForm.get('firstName').setValue(oneString[0], {emitEvent:false});
      }
    }
  }

  public search() {
    this._advsearchService.advsearch(this._advSearchForm.value)
      .subscribe(result=>{
        console.log(result);
      }, error=>{
        console.error(error);
      }, ()=>{
        console.log("DONE!");
      });
    console.log(this.processInput());
    console.log("GO search!");
  }

  private processInput(): string {
    return JSON.stringify(this._advSearchForm.value);
  }

  get advSearchForm(): FormGroup {
    return this._advSearchForm;
  }

}
