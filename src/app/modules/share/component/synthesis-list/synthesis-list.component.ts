import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user/user.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { PaginationTemplate } from '../../../../models/pagination';
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})
export class SynthesisListComponent implements OnInit {

  private _sharedGraph: any = [];

  totalReports: Array<object> = [];

  total: number;

  reportsDetails: any = [];

  displaySpinner = true;

  config = {
    fields: 'name,owner,principalMedia',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  paginationConfig: PaginationTemplate = {limit: this.config.limit, offset: this.config.offset};

  constructor( private _userService: UserService,
               private _innovationService: InnovationService ) { }

  ngOnInit() {

    this.getUserReports();

    this.displaySpinner = false;
  }

  private getUserReports() {
    this._userService.getSharedWithMe(this.config).first().subscribe((reports: any) => {
      this._sharedGraph = reports.sharedgraph || [];
      this._getSharedObjectsInformation();

    });
  }

  public getRelevantLink(report: any): string {
    if(report) {
      return `${environment.clientUrl}${report.link}`;
    } else {
      return "#";
    }
  }

  getMedia(report: any) {
    let src = 'https://res.cloudinary.com/umi/image/upload/v1535383716/app/default-images/image-not-available.png';

    if (report.media && report.media.type === 'PHOTO') {
      src = report.media.url;
    }
    return src;
  }

  /***
   * This function is called when there is cha change in the pagination. We update the config and
   * call the getUserReports().
   * @param value
   */
  configChange(value: any) {
    window.scroll(0, 0);
    this.paginationConfig = value;
    this.config.limit = value.limit;
    this.config.offset = value.offset;
    this.getUserReports();
  }

  private _getSharedObjectsInformation() {
    this._sharedGraph.forEach((info:any)=>{
      this._innovationService.get(info.sharedObjectId, this.config)
        .subscribe(result=>{
          let report = {
            name: result.name,
            owner: result.owner,
            media: result.principalMedia || null,
            objectId: info.sharedObjectId,
            sharedKey: info.sharedKey,
            date: info.created //TODO use the share date instead...
          };
          report['link'] = `/synthesis/${report.objectId}/${report.sharedKey}`;
          this.totalReports.push(report);
        }, err=>{
          console.error(err); //TODO
        });
    });
    console.log(this.totalReports);
  }

  get sharedGraph(): any {
    return this._sharedGraph;
  }

}
