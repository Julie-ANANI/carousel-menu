import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedInfographicCommentComponent } from './shared-infographic-comment.component';

describe('SharedInfographicCommentComponent', () => {
  let component: SharedInfographicCommentComponent;
  let fixture: ComponentFixture<SharedInfographicCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedInfographicCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedInfographicCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
