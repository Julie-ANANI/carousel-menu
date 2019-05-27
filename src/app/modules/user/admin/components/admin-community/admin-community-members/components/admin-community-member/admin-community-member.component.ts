import { Component, OnInit } from '@angular/core';
import { Professional } from '../../../../../../../../models/professional';
import { ActivatedRoute } from '@angular/router';
import { countries } from '../../../../../../../../models/static-data/country';
import { AutocompleteService } from '../../../../../../../../services/autocomplete/autocomplete.service';
import { lang, Language } from '../../../../../../../../models/static-data/language';
import { AmbassadorExperience, ambassadorExperiences } from '../../../../../../../../models/static-data/ambassador-experiences';
import { ambassadorPosition, AmbassadorPosition } from '../../../../../../../../models/static-data/ambassador-position';
import { Tag } from '../../../../../../../../models/tag';
import { TranslateService } from '@ngx-translate/core';
import { ProfessionalsService } from '../../../../../../../../services/professionals/professionals.service';
import { TranslateNotificationsService } from '../../../../../../../../services/notifications/notifications.service';
import { InnovationService } from '../../../../../../../../services/innovation/innovation.service';
import { Innovation } from '../../../../../../../../models/innovation';
import { InnovationFrontService } from '../../../../../../../../services/innovation/innovation-front.service';
import { InnovCard } from '../../../../../../../../models/innov-card';
import { TranslateTitleService } from '../../../../../../../../services/title/title.service';
import { Table } from '../../../../../../../table/models/table';
import { Company } from '../../../../../../../../models/company';

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

  private _companySuggestions: Array<Company> = [];

  private _displayCompanySuggestion = false;

  private _countries: any;

  private _saveChanges: boolean;

  private _totalTags: Array<Tag> = [];

  private _innovationsSuggested: Array<InnovCard> = [];

  private _emailTableInfo: Table = null;

  private _projectTableInfo: Table = null;

  private _fetchingError: boolean;

  private _allSectorTags: Array<Tag> = [];

  private _configInnovation = {
    fields: 'innovationCards principalMedia',
    limit: '0',
    offset: '0',
    isPublic: '1',
    $or: '[{"status":"EVALUATING"},{"status":"DONE"}]',
    sort: '{"created":-1}'
  };

  private _configProject = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _configEmail = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(private _activatedRoute: ActivatedRoute,
              private _autoCompleteService: AutocompleteService,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _professionalService: ProfessionalsService,
              private _translateNotificationService: TranslateNotificationsService,
              private _innovationService: InnovationService) {

    this._initializeVariables();

    if (typeof (this._activatedRoute.snapshot.data['professional']) !== 'undefined') {
      this._professional = this._activatedRoute.snapshot.data['professional'];

      this._translateTitleService.setTitle(`${this._professional.firstName} ${this._professional.lastName} | Professional`);

      if (Array.isArray(this._activatedRoute.snapshot.data['tagsSector'])) {
        this._allSectorTags = this._activatedRoute.snapshot.data['tagsSector'];
        this._getAllTags();
      } else {
        this._fetchingError = true;
        this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      }

      this._getAllInnovations();
      this._configureEmailTable();
      this._configureProjectTable();

    } else {
      this._fetchingError = true;
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    }

  }

  ngOnInit() {
    this._getEmails();
    this._getProjects();
  }


  /***
   * initializing all the variables to its default values.
   */
  private _initializeVariables() {
    this._saveChanges = false;
    this._experiences = ambassadorExperiences;
    this._positions = ambassadorPosition;
    this._languages = lang;
    this._countries = countries;
  }


  private _configureEmailTable() {
    this._emailTableInfo = {
      _selector: 'admin-community-member-email',
      _title: 'emails',
      _content: [],
      _total: 0,
      _isHeadable: true,
      _isShowable: true,
      _columns: [
        {
          _attrs: [''],
          _name: 'Emails',
          _type: 'TEXT'
        },
        {
          _attrs: [''],
          _name: 'Open',
          _type: 'MULTI-CHOICES',
          _isSortable: false,
          _choices: [
            {_name: '', _alias: '', _class: 'label label-alert'},
            {_name: '', _alias: '',  _class: 'label label-success'},
          ]
        },
        {
          _attrs: [''],
          _name: 'Click',
          _type: 'MULTI-CHOICES',
          _isSortable: false,
          _choices: [
            {_name: '', _alias: '', _class: 'label label-alert'},
            {_name: '', _alias: '',  _class: 'label label-success'},
          ]
        }
      ]
    };
  }


  private _configureProjectTable() {
    this._projectTableInfo = {
      _selector: 'admin-community-member-project',
      _title: 'projects',
      _content: [],
      _total: 0,
      _isHeadable: true,
      _isShowable: true,
      _columns: [
        {
          _attrs: [''],
          _name: 'Projects',
          _type: 'TEXT'
        },
        {
          _attrs: ['', ''],
          _name: 'Feedback',
          _type: 'MULTI-LABEL',
          _isSortable: false,
          _multiLabels: [
            {_attr: '', _class: 'label label-success'},
            {_attr: '', _class: 'label label-draft'}
          ],
        }
      ]
    };
  }





  /***
   * getting all the tags from the server to show under the lable sector tags.
   */
  private _getAllTags() {
    const activeLang = this.userLang;
    let tagsProfessional: Array<Tag> = [];
    let tagsRest: Array<Tag> = [];

    if (this._allSectorTags && this._allSectorTags.length > 0) {
      this._allSectorTags.forEach((tag) => {
        const find = this._professional.tags.find((tagPro) => tagPro._id === tag._id);
        if (find) {
          tagsProfessional.push(tag);
        } else {
          tagsRest.push(tag);
        }
      });

      tagsProfessional.sort((a,b) => {
        return a.label[activeLang].localeCompare(b.label[activeLang]);
      });

      tagsRest.sort((a,b) => {
        return a.label[activeLang].localeCompare(b.label[activeLang]);
      });

      this._totalTags = tagsProfessional.concat(tagsRest);
    }

  }


  private _getAllInnovations() {

    this._innovationsSuggested = [];

    this._innovationService.getAll(this._configInnovation).subscribe((response) => {
      if (response) {
        response.result.forEach((innovation: Innovation) => {
          innovation.tags.forEach((tag) => {
            const find = this._professional.tags.find((proTag) => proTag._id === tag._id);
            if (find) {
              if (innovation.innovationCards.length > 1) {
                const index = innovation.innovationCards.findIndex((innov) => innov.lang === this._professional.language);
                if (index !== -1) {
                  this._innovationsSuggested.push(innovation.innovationCards[index]);
                }
              } else {
                this._innovationsSuggested.push(innovation.innovationCards[0]);
              }
            }
          });
        });
      }
    }, () => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

  }


  private _getEmails() {
    // this._emailTableContent(emails, total);
  }


  /*private _emailTableContent(emails: Array<any>, total: number) {
   const tableInfos = this.emailTableInfo;
   tableInfos._content = emails;
   tableInfos._total = total;
   this.emailTableInfo = JSON.parse(JSON.stringify(tableInfos));
 }*/


  private _getProjects() {
    // this._projectTableContent(projects, total);
  }


  /*private _projectTableContent(projects: Array<any>, total: number) {
    const tableInfos = this.projectTableInfo;
    tableInfos._content = projects;
    tableInfos._total = total;
    this.projectTableInfo = JSON.parse(JSON.stringify(tableInfos));
  }*/


  /***
   * to notify the user if they perform any update in the professional object.
   */
  public notifyChanges() {
    this._saveChanges = true;
  }


  /***
   * to save the changes in professional object to the server.
   * Convert the professional into an ambassador.
   */
  public onClickSave() {
    this._professional.ambassador.is = this._professional.ambassador.is || true;

    this._professionalService.save(this._professional._id, this._professional).subscribe(() => {
      this._saveChanges = false;
      this._translateNotificationService.success('ERROR.SUCCESS', 'ERROR.ACCOUNT.PROFILE_UPDATE_TEXT');
      this._getAllInnovations();
    }, () => {
      this._translateNotificationService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  public onChangeMotivation(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.motivations = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  public onChangeQualification(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.qualification = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the motivation.
   * @param event
   */
  public onChangeActivity(event: Event) {
    if (event && event.target && event.target['value']) {
      this._professional.ambassador.activity = event.target['value'];
      this.notifyChanges();
    }
  }


  /***
   * when changing the value of the experience filed.
   * @param value
   */
  public onChangeExperience(value: string) {
    this.notifyChanges();
    this._professional.ambassador.experience = value;
  }


  /***
   * when changing the value of the position level filed.
   * @param value
   */
  public onChangePosition(value: string) {
    this.notifyChanges();
    this._professional.ambassador.positionLevel = value;
  }


  /***
   * when the operator starts tying in the company filed we show the company suggestions
   * according to the input.
   * @param input
   */
  public suggestCompanies(input: string) {
    if (input !== '') {
      this._displayCompanySuggestion = true;
      this._companySuggestions = [];
      this._autoCompleteService.get({query: input, type: 'company'}).subscribe((res: any) => {

        if (res.length === 0) {
          this._displayCompanySuggestion = false;
        } else {
          res.forEach((item: Company) => {
            const find = this._companySuggestions.find((company) => company.name === item.name);
            if (!find) {
              this._companySuggestions.push(item);
            }
          });

          this._companySuggestions.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });

        }
      });
    }
  }


  public onUpdateCompany(value: string) {
    this._professional.company = value;
    this._displayCompanySuggestion = false;
    this.notifyChanges();
  }


  /***
   * when changing the value of the language filed.
   * @param value
   */
  public onChangeLang(value: string) {
    this.notifyChanges();
    this._professional.language = value;
  }


  /***
   * when the operator starts tying in the country filed we show the country suggestions
   * according to the input.
   * @param input
   */
  public suggestCountries(input: string) {
    if (input !== '') {
      this._displayCountrySuggestion = true;
      this._countriesSuggestion = [];
      this._autoCompleteService.get({query: input, type: 'countries'}).subscribe((res: any) => {

        if (res.length === 0) {
          this._displayCountrySuggestion = false;
        } else {
          res.forEach((item: any) => {
            const valueIndex = this._countriesSuggestion.indexOf(item.name);
            if (valueIndex === -1) {
              this._countriesSuggestion.push(item.name);
            }
          });

          this._countriesSuggestion.sort();

        }
      });
    }
  }


  /***
   * when user selects the value from the suggested countries.
   * @param value
   */
  public onUpdateCountry(value: string) {
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
  public onCheckTag(tagId: string): boolean {
    return this._professional.tags.some((tag) => tag._id === tagId);
  }


  /***
   * based on the event we push and pop the tag from the professional
   * object.
   * @param event
   * @param tag
   */
  public onChangeTag(event: Event, tag: Tag) {

    if (event.target['checked']) {
      this._professional.tags.push(tag);
    } else {
      this._professional.tags = this._professional.tags.filter((tagPro) => tagPro._id !== tag._id)
    }

    this.notifyChanges();

  }


  public getImageSrc(innovation: InnovCard): string {
    return InnovationFrontService.getMediaSrc(innovation, 'default', '209', '130');
  }


  /***
   * when the clicks on the show button in the email table.
   * @param value
   */
  public onClickEmailShow(value: any) {

  }


  /***
   * when the clicks on the show button in the project table.
   * @param value
   */
  public onClickProjectShow(value: any) {

  }


  /***
   * when the user clicks on the push button.
   * @param innovation
   */
  public onClickPush(innovation: InnovCard) {

  }

  get userLang(): string {
    return this._translateService.currentLang;
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

  get totalTags(): Array<Tag> {
    return this._totalTags;
  }

  get innovationsSuggested(): Array<InnovCard> {
    return this._innovationsSuggested;
  }

  get configInnovation(): { offset: string; $or: string; limit: string; isPublic: string; sort: string; fields: string } {
    return this._configInnovation;
  }

  get emailTableInfo(): any {
    return this._emailTableInfo;
  }

  get projectTableInfo(): any {
    return this._projectTableInfo;
  }

  get configProject(): { search: string; offset: string; limit: string; sort: string; fields: string } {
    return this._configProject;
  }

  get configEmail(): { search: string; offset: string; limit: string; sort: string; fields: string } {
    return this._configEmail;
  }

  get companySuggestions(): Array<Company> {
    return this._companySuggestions;
  }

  get displayCompanySuggestion(): boolean {
    return this._displayCompanySuggestion;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get allSectorTags(): Array<Tag> {
    return this._allSectorTags;
  }

}

