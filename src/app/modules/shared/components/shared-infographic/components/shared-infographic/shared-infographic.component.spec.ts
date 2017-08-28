import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicComponent } from './shared-infographic.component';

describe('SharedInfographicComponent', () => {
  let component: SharedInfographicComponent;
  let fixture: ComponentFixture<SharedInfographicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
