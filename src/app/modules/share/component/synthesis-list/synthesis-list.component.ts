import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user/user.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { PaginationTemplate } from '../../../../models/pagination';

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
    fields: '',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  paginationConfig: PaginationTemplate = {limit: this.config.limit, offset: this.config.offset};

  constructor(private userService: UserService) { }
  public displaySpinner = false;
  constructor( private _userService: UserService,
               private _innovationService: InnovationService ) { }

  ngOnInit() {

    this.getUserReports();

    this.displaySpinner = false;

    /*this.userService.getSharedWithMe()
      .first().subscribe(result => {
        this._sharedGraph = result.sharedgraph || [];
    }, err => {
        this._getSharedObjectsInformation();
    }, err=>{
      console.log(err);
    });*/
  }

  private getUserReports() {
    this.userService.getSharedWithMe(this.config).first().subscribe((reports: any) => {
      console.log(this.totalReports);
      this.getDetails();
      console.log(this.totalReports);
    });
  }

  private getDetails() {

  }

  getRelevantLink() {

  }

  getMedia() {

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
      this._innovationService.get(info.sharedObjectId, {fields:"name,owner,principalMedia"})
        .subscribe(result=>{
          console.log(result);
        }, err=>{
          console.error(err);
        });
    })
  }

  get sharedGraph(): any {
    return this._sharedGraph;
  }

}
