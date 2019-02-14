import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignBatchComponent } from './admin-campaign-batch.component';

describe('AdminCampaignBatchComponent', () => {
  let component: AdminCampaignBatchComponent;
  let fixture: ComponentFixture<AdminCampaignBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignBatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
