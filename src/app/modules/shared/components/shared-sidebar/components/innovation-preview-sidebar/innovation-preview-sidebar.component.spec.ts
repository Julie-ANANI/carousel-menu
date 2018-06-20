import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovationPreviewSidebarComponent } from './innovation-preview-sidebar.component';

describe('InnovationPreviewSidebarComponent', () => {
  let component: InnovationPreviewSidebarComponent;
  let fixture: ComponentFixture<InnovationPreviewSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovationPreviewSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovationPreviewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
