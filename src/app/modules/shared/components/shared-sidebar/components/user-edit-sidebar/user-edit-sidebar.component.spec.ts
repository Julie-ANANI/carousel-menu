import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {UserEditSidebarComponent} from './user-edit-sidebar.component';

describe('UserEditSidebarComponent', () => {
  let component: UserEditSidebarComponent;
  let fixture: ComponentFixture<UserEditSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
