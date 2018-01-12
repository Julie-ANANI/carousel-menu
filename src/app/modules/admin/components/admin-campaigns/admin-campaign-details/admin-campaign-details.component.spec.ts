import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignDetailsComponent } from './admin-campaign-details.component';

describe('AdminCampaignDetailsComponent', () => {
  let component: AdminCampaignDetailsComponent;
  let fixture: ComponentFixture<AdminCampaignDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
