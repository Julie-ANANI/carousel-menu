import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInnovationSettingsComponent } from './client-innovation-settings.component';

describe('ClientInnovationSettingsComponent', () => {
  let component: ClientInnovationSettingsComponent;
  let fixture: ComponentFixture<ClientInnovationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInnovationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInnovationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
