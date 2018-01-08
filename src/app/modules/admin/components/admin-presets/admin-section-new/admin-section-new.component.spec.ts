import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSectionNewComponent } from './admin-section-new.component';

describe('AdminSectionNewComponent', () => {
  let component: AdminSectionNewComponent;
  let fixture: ComponentFixture<AdminSectionNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSectionNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSectionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
