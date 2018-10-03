import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../../services/user/user.service";

@Component({
  selector: 'app-synthesis-list',
  templateUrl: './synthesis-list.component.html',
  styleUrls: ['./synthesis-list.component.scss']
})
export class SynthesisListComponent implements OnInit {

  private _sharedGraph: any = [];

  public displaySpinner = false;
  constructor( private _userService: UserService ) { }

  ngOnInit() {
    this._userService.getSharedWithMe()
      .first().subscribe(result=>{
        this._sharedGraph = result.sharedgraph || [];
        console.log(this._sharedGraph);
    }, err=>{
      console.log(err);
    });
  }

  get sharedGraph(): any {
    return this._sharedGraph;
  }
}
