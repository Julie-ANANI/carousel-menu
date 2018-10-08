import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesisListComponent } from './synthesis-list.component';

describe('SynthesisListComponent', () => {
  let component: SynthesisListComponent;
  let fixture: ComponentFixture<SynthesisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynthesisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
