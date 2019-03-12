import { Component, OnInit } from '@angular/core';
import { Professional } from '../../../../../../../../models/professional';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../../../../../../../../models/static-data/country';
import { AutocompleteService } from '../../../../../../../../services/autocomplete/autocomplete.service';
import { lang, Language } from '../../../../../../../../models/static-data/language';
import { AmbassadorExperience, ambassadorExperiences } from '../../../../../../../../models/static-data/ambassador-experiences';
import { ambassadorPosition, AmbassadorPosition } from '../../../../../../../../models/static-data/ambassador-position';

@Component({
  selector: 'admin-community-member',
  templateUrl: './admin-community-member.component.html',
  styleUrls: ['./admin-community-member.component.scss']
})

export class AdminCommunityMemberComponent implements OnInit {

  professional: Professional;

  experiences: Array<AmbassadorExperience>;

  positionLevel: Array<AmbassadorPosition>;

  language: Array<Language>;

  countriesSuggestion: Array<string> = [];

  displayCountrySuggestion = false;

  countries = countries;

  constructor(private activatedRoute: ActivatedRoute,
              private autoCompleteService: AutocompleteService) { }

  ngOnInit() {
    this.professional = this.activatedRoute.snapshot.data['professional'];
    this.initializeVariables();

    console.log(this.professional);
  }


  private initializeVariables() {
    this.experiences = ambassadorExperiences;
    this.positionLevel = ambassadorPosition;
    this.language = lang;
  }


  onClickSave() {

  }


  onChangeExperience(value: string) {
    this.professional.ambassador.experience = value;
  }


  onChangePosition(value: string) {
    this.professional.ambassador.positionLevel = value;
  }


  onChangeLang(value: string) {
    this.professional.language = value;
  }


  onSuggestCountries(input: string) {
    if (input !== '') {
      this.displayCountrySuggestion = true;
      this.countriesSuggestion = [];
      this.autoCompleteService.get({query: input, type: 'countries'}).subscribe((res: any) => {
        if (res.length === 0) {
          this.displayCountrySuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this.countriesSuggestion.indexOf(items.name);
            if (valueIndex === -1) { // if not exist then push into the array.
              this.countriesSuggestion.push(items.name);
            }
          })
        }
      });
    }
  }


  onChangeCountry(value: string) {
    for (let code in this.countries) {
      if (this.countries[code] === value) {
        this.professional.country = code;
      }
    }
    this.displayCountrySuggestion = false;
  }


}

