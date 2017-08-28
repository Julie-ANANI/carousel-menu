import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicProfessionalCardComponent } from './shared-infographic-professional-card.component';

describe('SharedInfographicProfessionalCardComponent', () => {
  let component: SharedInfographicProfessionalCardComponent;
  let fixture: ComponentFixture<SharedInfographicProfessionalCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicProfessionalCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicProfessionalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
