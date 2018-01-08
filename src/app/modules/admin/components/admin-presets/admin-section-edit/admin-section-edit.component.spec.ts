import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSectionEditComponent } from './admin-section-edit.component';

describe('AdminSectionEditComponent', () => {
  let component: AdminSectionEditComponent;
  let fixture: ComponentFixture<AdminSectionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSectionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
