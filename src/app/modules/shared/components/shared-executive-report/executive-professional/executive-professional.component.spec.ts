import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveProfessionalComponent } from './executive-professional.component';

describe('ExecutiveProfessionalComponent', () => {
  let component: ExecutiveProfessionalComponent;
  let fixture: ComponentFixture<ExecutiveProfessionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveProfessionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveProfessionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
