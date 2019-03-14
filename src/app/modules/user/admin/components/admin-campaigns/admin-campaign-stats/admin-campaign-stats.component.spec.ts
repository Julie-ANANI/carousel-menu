import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignStatsComponent } from './admin-campaign-stats.component';

describe('AdminCampaignStatsComponent', () => {
  let component: AdminCampaignStatsComponent;
  let fixture: ComponentFixture<AdminCampaignStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
