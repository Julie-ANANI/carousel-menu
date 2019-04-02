import { Component, OnInit } from '@angular/core';
import { Professional } from '../../../../../../../../models/professional';
import { ActivatedRoute } from '@angular/router';
//import { countries } from '../../../../../../../../models/static-data/country';
import { AutocompleteService } from '../../../../../../../../services/autocomplete/autocomplete.service';
import { Language } from '../../../../../../../../models/static-data/language';
import { AmbassadorExperience } from '../../../../../../../../models/static-data/ambassador-experiences';
import { AmbassadorPosition } from '../../../../../../../../models/static-data/ambassador-position';
import { Tag } from '../../../../../../../../models/tag';
//import { TagsService } from '../../../../../../../../services/tags/tags.service';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ProfessionalsService } from '../../../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../../../services/notifications/notifications.service';
//import { InnovationService } from '../../../../../../../../services/innovation/innovation.service';
//import { Innovation } from '../../../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../../../../models/innov-card';

@Component({
  selector: 'admin-community-project',
  templateUrl: './admin-community-project.component.html',
  styleUrls: ['./admin-community-project.component.scss']
})

export class AdminCommunityProjectComponent implements OnInit {

  private _innovation: any;

  private _professional: Professional;

  private _experiences: Array<AmbassadorExperience>;

  private _positions: Array<AmbassadorPosition>;

  private _languages: Array<Language>;

  private _countriesSuggestion: Array<string> = [];

  private _displayCountrySuggestion = false;

  private _countries: any;

  private _saveChanges: boolean;

  private _tagsRest: Array<Tag> = [];

  private _tagsProfessional: Array<Tag> = [];

  private _innovationsSuggested: Array<InnovCard> = [];

  private _configTag = {
    limit: '0',
    offset: '0',
    search: '{"type":"SECTOR"}',
    sort: '{"label":-1}'
  };

  private _configInnovation = {
    fields: 'innovationCards principalMedia',
    limit: '0',
    offset: '0',
    isPublic: '1',
    $or: '[{"status":"EVALUATING"},{"status":"DONE"}]',
    sort: '{"created":-1}'
  };

  constructor(private activatedRoute: ActivatedRoute,
              private autoCompleteService: AutocompleteService,
              //private tagsService: TagsService,
              private translateService: TranslateService,
              private professionalService: ProfessionalsService,
              private translateNotificationService: TranslateNotificationsService,
              //private innovationService: InnovationService,
              private innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._innovation = this.activatedRoute.snapshot.data['innovation'];
    console.log(this._innovation);
    /*this.getAllTags();
    this.initializeVariables();
    this.getAllInnovations();*/
  }

  get innovation() {
    return this._innovation;
  }


  /***
   * initializing all the varaibles to its default values.
   */
  /*private initializeVariables() {
    this._saveChanges = false;
    this._experiences = ambassadorExperiences;
    this._positions = ambassadorPosition;
    this._languages = lang;
    this._countries = countries;
  }*/


  /***
   * checking the browser lang to get the tag label of same lang.
   */
  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }


  /***
   * getting all the tags from the server to show under the lable sector tags.
   */
  /*private getAllTags() {
    const activeLang = this.browserLang();
    this.tagsService.getAll(this._configTag).pipe(first()).subscribe((response) => {
      if (response) {
        response.result.forEach((tag) => {
          const find = this._professional.tags.find((tagPro) => tagPro._id === tag._id);
          if (find) {
            this._tagsProfessional.push(tag);
          } else {
            this._tagsRest.push(tag);
          }
        });
        this._tagsProfessional.sort((a,b) => {
          return a.label[activeLang].localeCompare(b.label[activeLang]);
        });

        this._tagsRest.sort((a,b) => {
          return a.label[activeLang].localeCompare(b.label[activeLang]);
        });
      }
    });
  }*/


  /*private getAllInnovations() {

    this._innovationsSuggested = [];

    this.innovationService.getAll(this._configInnovation).pipe(first()).subscribe((response) => {
      if (response) {
        response.result.forEach((innovation: Innovation) => {
          innovation.tags.forEach((tag) => {
            const find = this._professional.tags.find((proTag) => proTag._id === tag._id);
            if (find) {
              if (innovation.innovationCards.length > 1) {
                const index = innovation.innovationCards.findIndex((innov) => innov.lang === this._professional.language);
                if (index) {
                  this._innovationsSuggested.push(innovation.innovationCards[index]);
                }
              } else {
                this._innovationsSuggested.push(innovation.innovationCards[0]);
              }
            }
          });
        });
      }
    });

  }*/


  /***
   * to save the changes in professional object to the server.
   */
  onClickSave() {
    //Convert the professional into an ambassador
    this._professional.ambassador.is = this._professional.ambassador.is || true;
    this.professionalService.save(this._professional._id, this._professional).pipe(first()).subscribe(() => {
      this._saveChanges = false;
      this.translateNotificationService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      //this.getAllInnovations();
    }, () => {
      this.translateNotificationService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR')
    });
  }


  /***
   * to notify the user if they perform any update in the professional object.
   */
  notifyChanges() {
    this._saveChanges = true;
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  onChangeMotivation(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.motivations = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  onChangeQualification(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.qualification = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  onChangeActivity(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.activity = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the experience filed.
   * @param value
   */
  onChangeExperience(value: string) {
    this.notifyChanges();
    this._professional.ambassador.experience = value;
  }


  /***
   * when changing the value of the position level filed.
   * @param value
   */
  onChangePosition(value: string) {
    this.notifyChanges();
    this._professional.ambassador.positionLevel = value;
  }


  /***
   * when changing the value of the language filed.
   * @param value
   */
  onChangeLang(value: string) {
    this.notifyChanges();
    this._professional.language = value;
  }


  /***
   * when the user starts tying in the country filed we show the country suggestions
   * according to the input.
   * @param input
   */
  onSuggestCountries(input: string) {
    if (input !== '') {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      this.autoCompleteService.get({query: input, type: 'countries'}).subscribe((res: any) => {
        if (res.length === 0) {
          this._displayCountrySuggestion = false;
        } else {
          res.forEach((items: any) => {
            const valueIndex = this._countriesSuggestion.indexOf(items.name);
            if (valueIndex === -1) { // if not exist then push into the array.
              this._countriesSuggestion.push(items.name);
            }
          })
        }
      });
    }
  }


  /***
   * when user selects the value from the suggested countries.
   * @param value
   */
  onChangeCountry(value: string) {
    for (let code in this._countries) {
      if (this._countries[code] === value) {
        this._professional.country = code;
      }
    }
    this.notifyChanges();
    this._displayCountrySuggestion = false;
  }


  /***
   * activate the tag that is associated with the professional.
   * @param tagId
   */
  onCheckTag(tagId: string): boolean {
    if (tagId) {
      const find = this._professional.tags.find((tag) => tag._id === tagId);
      if (find) {
        return true;
      }
    }
    return false;
  }


  /***
   * based on the event we push and pop the tag from the professional
   * object.
   * @param event
   * @param tag
   */
  onChangeTag(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._professional.tags.push(tag);
    } else {
      this._professional.tags.splice(this._professional.tags.indexOf(tag), 1);
    }

    this.notifyChanges();

  }


  getImageSrc(innovation: InnovCard): string {
    return this.innovationFrontService.getMediaSrc(innovation, 'default', '209', '130');
  }


  /***
   * whent the user clicks on the push button.
   * @param innovation
   */
  onClickPush(innovation: InnovCard) {

  }


  get professional(): Professional {
    return this._professional;
  }

  get experiences(): Array<AmbassadorExperience> {
    return this._experiences;
  }

  get positions(): Array<AmbassadorPosition> {
    return this._positions;
  }

  get languages(): Array<Language> {
    return this._languages;
  }

  get countriesSuggestion(): Array<string> {
    return this._countriesSuggestion;
  }

  get displayCountrySuggestion(): boolean {
    return this._displayCountrySuggestion;
  }

  get countries(): any {
    return this._countries;
  }

  get saveChanges(): boolean {
    return this._saveChanges;
  }

  get tagsRest(): Array<Tag> {
    return this._tagsRest;
  }

  get configTag(): { search: string; offset: string; limit: string; sort: string } {
    return this._configTag;
  }

  get tagsProfessional(): Array<Tag> {
    return this._tagsProfessional;
  }

  get innovationsSuggested(): Array<InnovCard> {
    return this._innovationsSuggested;
  }

  get configInnovation(): { offset: string; $or: string; limit: string; isPublic: string; sort: string; fields: string } {
    return this._configInnovation;
  }

}

