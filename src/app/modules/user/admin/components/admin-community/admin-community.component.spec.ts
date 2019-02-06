import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {AdminCommunityComponent} from './admin-community.component';

describe('AdminProfessionalsComponent', () => {
  let component: AdminCommunityComponent;
  let fixture: ComponentFixture<AdminCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCommunityComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
