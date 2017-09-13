import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUserComponent } from './client-user.component';

describe('ClientUserComponent', () => {
  let component: ClientUserComponent;
  let fixture: ComponentFixture<ClientUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
