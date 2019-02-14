import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveConclusionComponent } from './executive-conclusion.component';

describe('ExecutiveConclusionComponent', () => {
  let component: ExecutiveConclusionComponent;
  let fixture: ComponentFixture<ExecutiveConclusionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveConclusionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveConclusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
