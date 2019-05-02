import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationDetailComponent } from './innovation-detail.component';

describe('InnovationDetailComponent', () => {
  let component: InnovationDetailComponent;
  let fixture: ComponentFixture<InnovationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
