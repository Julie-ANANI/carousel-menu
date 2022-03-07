import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketReportResultComponent } from './market-report-result.component';

describe('MarketReportResultComponent', () => {
  let component: MarketReportResultComponent;
  let fixture: ComponentFixture<MarketReportResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketReportResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketReportResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
