import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMyUsersComponent } from './client-my-users.component';

describe('ClientUsersComponent', () => {
  let component: ClientMyUsersComponent;
  let fixture: ComponentFixture<ClientMyUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMyUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMyUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
