import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationFormComponent } from './innovation-form.component';

describe('InnovationFormComponent', () => {
  let component: InnovationFormComponent;
  let fixture: ComponentFixture<InnovationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
