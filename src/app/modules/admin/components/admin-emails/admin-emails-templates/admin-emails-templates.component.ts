import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { EmailScenario } from '../../../../../models/email-scenario';
import { EmailSignature } from '../../../../../models/email-signature';

@Component({
  selector: 'app-admin-email-templates',
  templateUrl: 'admin-emails-templates.component.html',
  styleUrls: ['admin-emails-templates.component.scss']
})
export class AdminEmailTemplatesComponent implements OnInit {

  private _scenarios: Array<EmailScenario>;
  private _signatures: Array<EmailSignature>;

  constructor(private _templatesService: TemplatesService) {}

  ngOnInit() {
    this.getScenarios();
    this.getSignatures();
  }
  
  public getScenarios() {
    this._templatesService.getAll({limit: 0}).first().subscribe((scenarios: any) => {
      this._scenarios = scenarios.result;
    });
  }
  
  public getSignatures() {
    this._templatesService.getAllSignatures({limit: 0}).first().subscribe((signatures: any) => {
      this._signatures = signatures.result;
    });
  }

  get scenarios(): Array<EmailScenario> { return this._scenarios; }
  get signatures(): Array<EmailSignature> { return this._signatures; }
}
