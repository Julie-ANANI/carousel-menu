import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationsService } from "angular2-notifications";
import { ProfessionalsService } from "../../../../services/professionals/professionals.service";

@Component({
  selector: 'csv-upload-form',
  templateUrl: './csvupload-form.component.html',
  styleUrls: ['./cvsupload-form.component.scss']
})

export class CSVUploadFormComponent implements OnInit {

  @Output() finalOutput = new EventEmitter<any>();

  private _uploadResults: any = {};


  constructor(private _professionalService: ProfessionalsService,
              private _notificationsService: NotificationsService) { }

  ngOnInit() {
  }

  public importAmbassadors(file: File, event: Event) {
    event.preventDefault();
    this._professionalService.importAmbassadorsFromCSV(file)
      .subscribe((res: any) => {
        const total = (res.regSuccess || []).length + (res.regErrors || []).length;
        this._notificationsService.success('ERROR.SUCCESS', `${(res.regSuccess || []).length}/${total} ambassadors has been added`);
        this._uploadResults = res;
      }, (err: any) => {
        this._notificationsService.error('ERROR.ERROR', err.message);
      },()=>{
        this.finalOutput.emit(this._uploadResults);
      });
  }

  get uploadResults(): any {
    return this._uploadResults;
  }

}
