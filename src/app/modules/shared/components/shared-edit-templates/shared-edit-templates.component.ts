import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
// import { EmailTemplate } from '../../../../models/email-template';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from '../../../../models/campaign';

@Component({
  selector: 'app-shared-edit-templates',
  templateUrl: 'shared-edit-templates.component.html',
  styleUrls: ['shared-edit-templates.component.scss']
})
export class SharedEditTemplatesComponent implements OnInit {

  @Input() public ArgScenarios: Array<EmailScenario>;
  @Output() scenarioChange = new EventEmitter <Array<EmailScenario>>();
  private _availableScenarios: Array<EmailScenario>;
  private _campaign: Campaign;

  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._campaign = this._activatedRoute.snapshot.parent.data['campaign'];
    this._availableScenarios = this.ArgScenarios;
    console.log(JSON.stringify(this._availableScenarios));
  }

}
