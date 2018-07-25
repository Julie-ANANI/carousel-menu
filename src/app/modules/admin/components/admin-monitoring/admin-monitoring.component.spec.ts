import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMonitoringComponent } from './admin-monitoring.component';

describe('AdminMonitoringComponent', () => {
  let component: AdminMonitoringComponent;
  let fixture: ComponentFixture<AdminMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
