import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetingDetailComponent } from './targeting-detail.component';

describe('TargetingDetailComponent', () => {
  let component: TargetingDetailComponent;
  let fixture: ComponentFixture<TargetingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
