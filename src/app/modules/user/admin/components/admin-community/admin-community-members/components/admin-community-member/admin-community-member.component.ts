import { Component, OnInit } from '@angular/core';
import { Professional } from '../../../../../../../../models/professional';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../../../../../../../../models/static-data/country';
import { AutocompleteService } from '../../../../../../../../services/autocomplete/autocomplete.service';
import { lang, Language } from '../../../../../../../../models/static-data/language';
import { AmbassadorExperience, ambassadorExperiences } from '../../../../../../../../models/static-data/ambassador-experiences';
import { ambassadorPosition, AmbassadorPosition } from '../../../../../../../../models/static-data/ambassador-position';
import { Tag } from '../../../../../../../../models/tag';
import { TagsService } from '../../../../../../../../services/tags/tags.service';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ProfessionalsService } from '../../../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../../../../models/innov-card';

@Component({
  selector: 'admin-community-member',
  templateUrl: './admin-community-member.component.html',
  styleUrls: ['./admin-community-member.component.scss']
})

export class AdminCommunityMemberComponent implements OnInit {

  private _professional: Professional;

  private _experiences: Array<AmbassadorExperience>;

  private _positions: Array<AmbassadorPosition>;

  private _languages: Array<Language>;

  private _countriesSuggestion: Array<string> = [];

  private _displayCountrySuggestion = false;

  private _countries: any;

  private _saveChanges: boolean;

  private _tags: Array<Tag> = [];

  innovationsSuggested: Array<InnovCard> = [];

  private _configTag = {
    limit: '0',
    offset: '0',
    search: '{"type":"SECTOR"}',
    sort: '{"label":-1}'
  };

  configInnovation = {
    fields: 'innovationCards principalMedia',
    limit: '0',
    offset: '0',
    isPublic: '1',
    $or: '[{"status":"EVALUATING"},{"status":"DONE"}]',
    sort: '{"created":-1}'
  };

  constructor(private activatedRoute: ActivatedRoute,
              private autoCompleteService: AutocompleteService,
              private tagsService: TagsService,
              private translateService: TranslateService,
              private professionalService: ProfessionalsService,
              private translateNotificationService: TranslateNotificationsService,
              private innovationService: InnovationService,
              private innovationFrontService: InnovationFrontService) { }

  ngOnInit() {
    this._professional = this.activatedRoute.snapshot.data['professional'];
    this.getAllTags();
    this.initializeVariables();
    this.getAllInnovations();
  }


  /***
   * initializing all the varaibles to its default values.
   */
  private initializeVariables() {
    this._saveChanges = false;
    this._experiences = ambassadorExperiences;
    this._positions = ambassadorPosition;
    this._languages = lang;
    this._countries = countries;
  }


  /***
   * checking the browser lang to get the tag label of same lang.
   */
  browserLang(): string {
    return this.translateService.getBrowserLang() || 'en';
  }


  /***
   * getting all the tags from the server to show under the lable sector tags.
   */
  private getAllTags() {
    this.tagsService.getAll(this._configTag).pipe(first()).subscribe((response) => {
      if (response) {
        this._tags = response.result;
      }
    });
  }


  private getAllInnovations() {

    this.innovationsSuggested = [];

    this.innovationService.getAll(this.configInnovation).pipe(first()).subscribe((response) => {
      if (response) {
        response.result.forEach((innovation: Innovation) => {
          innovation.tags.forEach((tag) => {
            const find = this._professional.tags.find((proTag) => proTag._id === tag._id);
            if (find) {
              if (innovation.innovationCards.length > 1) {
                const index = innovation.innovationCards.findIndex((innov) => innov.lang === this._professional.language);
                if (index) {
                  this.innovationsSuggested.push(innovation.innovationCards[index]);
                }
              } else {
                this.innovationsSuggested.push(innovation.innovationCards[0]);
              }
            }
          });
        });
      }
    });

  }


  /***
   * to save the changes in professional object to the server.
   */
  onClickSave() {
    this.professionalService.save(this._professional._id, this._professional).pipe(first()).subscribe(() => {
      this._saveChanges = false;
      this.translateNotificationService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      this.getAllInnovations();
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

  get tags(): Array<Tag> {
    return this._tags;
  }

  get configTag(): { search: string; offset: string; limit: string; sort: string } {
    return this._configTag;
  }

}

