import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTargetingDetailComponent } from './shared-targeting-detail.component';

describe('SharedTargetingDetailComponent', () => {
  let component: SharedTargetingDetailComponent;
  let fixture: ComponentFixture<SharedTargetingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTargetingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTargetingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
