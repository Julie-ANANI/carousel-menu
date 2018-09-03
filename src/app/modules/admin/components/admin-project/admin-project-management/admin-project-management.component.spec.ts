import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectManagementComponent } from './admin-project-management.component';

describe('AdminProjectManagementComponent', () => {
  let component: AdminProjectManagementComponent;
  let fixture: ComponentFixture<AdminProjectManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProjectManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
