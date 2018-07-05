import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientForgetPasswordComponent } from './client-forget-password.component';

describe('ClientForgetPasswordComponent', () => {
  let component: ClientForgetPasswordComponent;
  let fixture: ComponentFixture<ClientForgetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientForgetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientForgetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
