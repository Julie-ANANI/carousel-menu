import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCampaignsComponent } from './client-campaigns.component';

describe('ClientCampaignComponent', () => {
  let component: ClientCampaignComponent;
  let fixture: ComponentFixture<ClientCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
