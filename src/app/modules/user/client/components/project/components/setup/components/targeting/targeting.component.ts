import {Component, OnInit} from '@angular/core';
import {InnovationFrontService} from '../../../../../../../../../services/innovation/innovation-front.service';
import {CanComponentDeactivate} from '../../../../../../../../../guards/can-deactivate-guard.service';
import {Observable} from 'rxjs';

@Component({
  templateUrl: './targeting.component.html',
  styleUrls: ['./targeting.component.scss']
})

export class TargetingComponent implements OnInit, CanComponentDeactivate {

  private _changesSaved = false;

  constructor(private _innovationFrontService: InnovationFrontService) { }

  ngOnInit(): void {
    this._innovationFrontService.getNotifyChanges().subscribe((value) => {
      if (value && value.key === 'settings') {
        this._changesSaved = value && value.state;
      }
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return !this._changesSaved;
  }

}
