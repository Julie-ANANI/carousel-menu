import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { EmailSignature } from '../../../../../models/email-signature';

@Component({
  selector: 'app-admin-signatures-library',
  templateUrl: 'admin-signatures-library.component.html',
  styleUrls: ['admin-signatures-library.component.scss']
})
export class AdminSignaturesLibraryComponent implements OnInit {

  private _signatures: Array<EmailSignature>;

  constructor(private _templatesService: TemplatesService) {}

  ngOnInit() {
    this.getSignatures();
  }
  
  public getSignatures() {
    this._templatesService.getAllSignatures({limit: 0}).first().subscribe((signatures: any) => {
      this._signatures = signatures.result;
    });
  }

  get signatures(): Array<EmailSignature> { return this._signatures; }
}
