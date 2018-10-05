import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user/user.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})
export class SynthesisListComponent implements OnInit {

  private _sharedGraph: any = [];

  public displaySpinner = false;
  constructor( private _userService: UserService,
               private _innovationService: InnovationService ) { }

  ngOnInit() {
    this._userService.getSharedWithMe()
      .first().subscribe(result=>{
        this._sharedGraph = result.sharedgraph || [];
        this._getSharedObjectsInformation();
    }, err=>{
      console.log(err);
    });
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
