import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisCompleteComponent } from './synthesis-complete.component';

describe('SynthesisCompleteComponent', () => {
  let component: SynthesisCompleteComponent;
  let fixture: ComponentFixture<SynthesisCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesisCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
