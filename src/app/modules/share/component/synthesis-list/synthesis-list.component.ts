import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})
export class SynthesisListComponent implements OnInit {

  private _sharedGraph: any = [];

  totalReports: Array<object> = [];

  reportsDetails: any = [];

  displaySpinner = true;

  config = {
    fields: 'owner',
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor( private userService: UserService ) { }

  ngOnInit() {

    this.getUserReports();

    this.displaySpinner = false;

    /*this.userService.getSharedWithMe()
      .first().subscribe(result => {
        this._sharedGraph = result.sharedgraph || [];
    }, err => {
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

  get sharedGraph(): any {
    return this._sharedGraph;
  }
}
