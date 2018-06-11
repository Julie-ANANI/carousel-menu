import { Component, OnInit, Input } from '@angular/core';
import { EmailScenario } from '../../../../../models/email-scenario';


@Component({
  selector: 'app-admin-campaign-abtesting',
  templateUrl: './admin-campaign-abtesting.component.html',
  styleUrls: ['./admin-campaign-abtesting.component.scss']
})
export class AdminCampaignAbtestingComponent implements OnInit {

  @Input() private _modifiedScenarios: Array<EmailScenario> ;


  private _nameWorkflowA: String = '';
  private _nameWorkflowB: String = '';
  private _sizeA: Number;
  private _sizeB: Number;

  public switchActivated: Boolean = false;

  constructor() { }

  ngOnInit() {
  }



  get nameWorkflowA(): String { return this._nameWorkflowA };
  get nameWorkflowB(): String { return this._nameWorkflowB };
  get sizeA(): Number { return this._sizeA };
  get sizeB(): Number { return this._sizeB };
  get modifiedScenarios(): Array<EmailScenario> { return this._modifiedScenarios };


  set nameWorkflowA(arg: String) { this._nameWorkflowA = arg};
  set nameWorkflowB(arg: String) { this._nameWorkflowB = arg};
  set sizeA(arg: Number) { this._sizeA = arg};
  set sizeB(arg: Number) { this._sizeB = arg};

}
