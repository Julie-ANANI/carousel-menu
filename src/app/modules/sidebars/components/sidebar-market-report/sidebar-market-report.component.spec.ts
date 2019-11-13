import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMarketReportComponent } from './sidebar-market-report.component';

describe('SidebarMarketReportComponent', () => {
  let component: SidebarMarketReportComponent;
  let fixture: ComponentFixture<SidebarMarketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarMarketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMarketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
