import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailsComponent } from './admin-emails.component';

describe('AdminEmailsComponent', () => {
  let component: AdminEmailsComponent;
  let fixture: ComponentFixture<AdminEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
