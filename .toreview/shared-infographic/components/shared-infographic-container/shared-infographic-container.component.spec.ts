import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicContainerComponent } from './shared-infographic-container.component';

describe('SharedInfographicContainerComponent', () => {
  let component: SharedInfographicContainerComponent;
  let fixture: ComponentFixture<SharedInfographicContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
