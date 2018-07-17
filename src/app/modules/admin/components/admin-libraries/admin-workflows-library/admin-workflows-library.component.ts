import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { EmailScenario } from '../../../../../models/email-scenario';

@Component({
  selector: 'app-admin-workflows-library',
  templateUrl: 'admin-workflows-library.component.html',
  styleUrls: ['admin-workflows-library.component.scss']
})
export class AdminWorkflowsLibraryComponent implements OnInit {

  private _scenarios: Array<EmailScenario>;

  constructor(private _templatesService: TemplatesService) {}

  ngOnInit() {
    this.getScenarios();
  }
  
  public getScenarios() {
    this._templatesService.getAll({limit: 0}).first().subscribe((scenarios: any) => {
      this._scenarios = scenarios.result;
    });
  }

  get scenarios(): Array<EmailScenario> { return this._scenarios; }
}
