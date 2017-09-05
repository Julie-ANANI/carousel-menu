import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCampaignsComponent } from './client-campaigns.component';

describe('ClientLoginComponent', () => {
  let component: ClientCampaignsComponent;
  let fixture: ComponentFixture<ClientCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
