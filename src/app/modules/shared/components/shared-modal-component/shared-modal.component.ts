import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'modal',
  templateUrl:  './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss']
})


export class SharedModalComponent implements OnInit {

  @Input() title: string;
  @Input() size: string;

  private _active = false;

  ngOnInit() {
    if (this.size != 'lg' && this.size !='md' && this.size !='sm') {
      this.size = 'md';
      console.log("Wrong modal size specified, medium has been used");
    }
  }

  set active (value: boolean) {
    this._active = value;
  }

  get active(): boolean {
    return this._active;
  }

}
