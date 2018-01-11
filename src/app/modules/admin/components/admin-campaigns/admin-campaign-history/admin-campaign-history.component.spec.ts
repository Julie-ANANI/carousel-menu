import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignHistoryComponent } from './admin-campaign-history.component';

describe('AdminCampaignHistoryComponent', () => {
  let component: AdminCampaignHistoryComponent;
  let fixture: ComponentFixture<AdminCampaignHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
