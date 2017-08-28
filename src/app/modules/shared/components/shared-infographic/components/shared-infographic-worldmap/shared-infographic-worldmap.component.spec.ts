import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicWorldmapComponent } from './shared-infographic-worldmap.component';

describe('SharedWorldmapComponent', () => {
  let component: SharedInfographicWorldmapComponent;
  let fixture: ComponentFixture<SharedInfographicWorldmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicWorldmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicWorldmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
