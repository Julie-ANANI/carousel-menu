import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInnovationDetailComponent } from './shared-innovation-detail.component';

describe('SharedInnovationDetailComponent', () => {
  let component: SharedInnovationDetailComponent;
  let fixture: ComponentFixture<SharedInnovationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInnovationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInnovationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
