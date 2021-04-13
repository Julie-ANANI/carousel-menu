import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MissionService} from '../../../../services/mission/mission.service';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {MailConfiguration, Mission} from '../../../../models/mission';
import {EmailService} from '../../../../services/email/email.service';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.scss']
})

export class MissionFormComponent {

  @Input() set mission(value: Mission) {
    if (!!value) {
      this._selectedServiceMeta = {};
      this._missionForm.patchValue({_id: value._id, name: value.name, goal: value.goal});
      /* format dates */
      this._missionForm.controls.milestoneDates = this.formBuilder.array(
        value.milestoneDates.map((milestone) => {
          return new FormGroup({
            name: new FormControl(milestone.name),
            dueDate: new FormControl(new Date(milestone.dueDate).toISOString().slice(0, 10)),
            code: new FormControl(milestone.code)
          });
        })
      );
      value.mailConf = value.mailConf || []; //This is for old missions...
      value.mailConf.forEach(_config => {
        const key = _config.service + '_' + _config.domain;
        this._selectedServiceMeta[key] = true;
      });
    }
  }

  @Output() missionChange = new EventEmitter<Mission>();

  private _missionForm: FormGroup;

  private _selectedServiceMeta = {};

  // private _mailServicesConfigurations: Array<MailConfiguration> = [];

  constructor(private formBuilder: FormBuilder,
              private missionService: MissionService,
              private translateNotificationsService: TranslateNotificationsService,
              private _emailService: EmailService) {

    this._missionForm = this.formBuilder.group({
      _id: new FormControl(''),
      name: new FormControl(''),
      goal: new FormControl(''),
      milestoneDates: new FormArray([]),
      mailConf: new FormArray([]),
    });

    this._emailService.getMailServiceConfigurations()
      .subscribe(config => {
        // this._mailServicesConfigurations = config.filter( (_config: any) => {return _config.service !== 'gmail';}) || [];

        this._missionForm.controls.mailConf = this.formBuilder.array(
          config.filter((_config: any) => {
            return _config.service !== 'gmail';
          })
            .map((_config: MailConfiguration) => {
              return new FormGroup({
                domain: new FormControl(_config.domain),
                service: new FormControl(_config.service),
                region: new FormControl(_config.region)
              });
            })
        );
      }, err => {
        this.translateNotificationsService.error('ERROR.SUCCESS', err.message);
      });


  }

  newMilestone(event: Event) {
    event.preventDefault();
    this.milestoneDates.push(new FormGroup({name: new FormControl(''), dueDate: new FormControl('')}));
  }

  removeMilestone(event: Event, index: number) {
    event.preventDefault();
    this.milestoneDates.removeAt(index);
  }

  toggleDomain(event: Event, index: number) {
    // get the key
    let value = this._missionForm.get('mailConf').value[index];
    value = `${value.service}_${value.domain}`;
    this._selectedServiceMeta[value] = !this._selectedServiceMeta[value];
  }

  onSave(event: Event) {
    event.preventDefault();
    const mission: Mission = this._missionForm.getRawValue();
    // Filter the domains
    mission.mailConf = mission.mailConf.filter(_config => {
      const value = `${_config.service}_${_config.domain}`;
      return !!this._selectedServiceMeta[value];
    });
    const missionObject = {
      mailConf: mission.mailConf,
      milestoneDates: mission.milestoneDates
    };
    this.missionService.save(mission._id, missionObject).subscribe((savedMission) => {
      this.missionChange.emit(savedMission);
      this.translateNotificationsService.success('ERROR.SUCCESS', 'SUCCESS');
    }, (err) => {
      this.translateNotificationsService.error('ERROR.SUCCESS', err.message);
    });
  }

  public getServiceDomainLabel(index: number) {
    if (index >= 0 && index < this._missionForm.get('mailConf').value.length) {
      const value = this._missionForm.get('mailConf').value[index];
      return `${value.service} - ${value.domain.length > 20 ? value.domain.substring(0, 8) + '...' + value.domain.substring(value.domain.length - 8) : value.domain}`;
    }
  }

  get missionForm(): FormGroup {
    return this._missionForm;
  }

  get milestoneDates(): FormArray {
    return this._missionForm.get('milestoneDates') as FormArray;
  }

  get mailServicesConfigurations(): FormArray {
    return this._missionForm.get('mailConf') as FormArray;
  }

  get selectedServiceMeta() {
    return this._selectedServiceMeta;
  }

}
