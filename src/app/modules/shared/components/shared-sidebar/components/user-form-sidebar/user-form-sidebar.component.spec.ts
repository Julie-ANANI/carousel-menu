import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormSidebarComponent } from './user-form-sidebar.component';

describe('UserFormSidebarComponent', () => {
  let component: UserFormSidebarComponent;
  let fixture: ComponentFixture<UserFormSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFormSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
