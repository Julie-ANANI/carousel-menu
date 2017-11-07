import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  template: '<app-shared-header></app-shared-header><main><router-outlet></router-outlet></main><app-client-footer></app-client-footer>',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor () {}

  ngOnInit(): void {
  }

}
