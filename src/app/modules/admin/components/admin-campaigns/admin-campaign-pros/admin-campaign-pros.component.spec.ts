import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCampaignProsComponent } from './admin-campaign-pros.component';

describe('AdminCampaignProsComponent', () => {
  let component: AdminCampaignProsComponent;
  let fixture: ComponentFixture<AdminCampaignProsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCampaignProsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCampaignProsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
