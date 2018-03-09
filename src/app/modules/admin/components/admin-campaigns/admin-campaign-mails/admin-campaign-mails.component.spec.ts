import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignMailsComponent } from './admin-campaign-mails.component';

describe('AdminCampaignMailsComponent', () => {
  let component: AdminCampaignMailsComponent;
  let fixture: ComponentFixture<AdminCampaignMailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignMailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
