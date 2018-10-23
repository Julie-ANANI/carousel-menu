import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveSectionComponent } from './executive-section.component';

describe('ExecutiveSectionComponent', () => {
  let component: ExecutiveSectionComponent;
  let fixture: ComponentFixture<ExecutiveSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
