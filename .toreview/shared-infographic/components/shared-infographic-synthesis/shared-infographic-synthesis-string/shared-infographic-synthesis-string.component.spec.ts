import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicSynthesisStringComponent } from './shared-infographic-synthesis-string.component';

describe('SharedInfographicSynthesisStringComponent', () => {
  let component: SharedInfographicSynthesisStringComponent;
  let fixture: ComponentFixture<SharedInfographicSynthesisStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicSynthesisStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicSynthesisStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
