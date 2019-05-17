import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchingErrorComponent } from './fetching-error.component';

describe('MessageSpaceComponent', () => {
  let component: FetchingErrorComponent;
  let fixture: ComponentFixture<FetchingErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchingErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchingErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
