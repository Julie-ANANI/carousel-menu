import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AdminProfessionalsComponent} from './admin-professionals.component';

describe('AdminProfessionalsComponent', () => {
  let component: AdminProfessionalsComponent;
  let fixture: ComponentFixture<AdminProfessionalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProfessionalsComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
