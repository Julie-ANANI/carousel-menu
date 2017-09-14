import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicSynthesisComponent } from './shared-infographic-synthesis.component';

describe('SharedInfographicSynthesisComponent', () => {
  let component: SharedInfographicSynthesisComponent;
  let fixture: ComponentFixture<SharedInfographicSynthesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicSynthesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicSynthesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
