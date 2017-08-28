import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicSynthesisQCMComponent } from './shared-infographic-synthesis-qcm.component';

describe('SharedInfographicSynthesisBooleanComponent', () => {
  let component: SharedInfographicSynthesisQCMComponent;
  let fixture: ComponentFixture<SharedInfographicSynthesisQCMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicSynthesisQCMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicSynthesisQCMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
