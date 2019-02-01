import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignSearchComponent } from './admin-campaign-search.component';

describe('AdminCampaignSearchComponent', () => {
  let component: AdminCampaignSearchComponent;
  let fixture: ComponentFixture<AdminCampaignSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
