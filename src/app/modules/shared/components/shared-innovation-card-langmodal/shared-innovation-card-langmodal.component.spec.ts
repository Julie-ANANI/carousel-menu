import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInnovationCardLangmodalComponent } from './shared-innovation-card-langmodal.component';

describe('SharedInnovationCardLangmodalComponent', () => {
  let component: SharedInnovationCardLangmodalComponent;
  let fixture: ComponentFixture<SharedInnovationCardLangmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInnovationCardLangmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInnovationCardLangmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
