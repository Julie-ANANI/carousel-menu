import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicSynthesisWorldmapComponent } from './shared-infographic-synthesis-worldmap.component';

describe('SharedInfographicSynthesisWorldmapComponent', () => {
  let component: SharedInfographicSynthesisWorldmapComponent;
  let fixture: ComponentFixture<SharedInfographicSynthesisWorldmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicSynthesisWorldmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicSynthesisWorldmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
