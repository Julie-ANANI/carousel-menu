import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationPreviewComponent } from './innovation-preview.component';

describe('InnovationPreviewComponent', () => {
  let component: InnovationPreviewComponent;
  let fixture: ComponentFixture<InnovationPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovationPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
