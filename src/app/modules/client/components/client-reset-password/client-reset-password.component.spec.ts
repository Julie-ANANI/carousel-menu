import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResetPasswordComponent } from './client-reset-password.component';

describe('ClientResetPasswordComponent', () => {
  let component: ClientResetPasswordComponent;
  let fixture: ComponentFixture<ClientResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientResetPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
