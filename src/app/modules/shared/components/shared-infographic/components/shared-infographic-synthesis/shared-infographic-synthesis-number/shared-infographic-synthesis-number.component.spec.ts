import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicSynthesisNumberComponent } from './shared-infographic-synthesis-number.component';

describe('SharedInfographicSynthesisNumberComponent', () => {
  let component: SharedInfographicSynthesisNumberComponent;
  let fixture: ComponentFixture<SharedInfographicSynthesisNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicSynthesisNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicSynthesisNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
