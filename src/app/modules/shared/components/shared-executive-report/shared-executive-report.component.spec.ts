import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedExecutiveReportComponent } from './shared-executive-report.component';

describe('SharedExecutiveReportComponent', () => {
  let component: SharedExecutiveReportComponent;
  let fixture: ComponentFixture<SharedExecutiveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedExecutiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedExecutiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
