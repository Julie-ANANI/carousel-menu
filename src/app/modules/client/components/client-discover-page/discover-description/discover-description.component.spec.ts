import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverDescriptionComponent } from './discover-description.component';

describe('DiscoverDescriptionComponent', () => {
  let component: DiscoverDescriptionComponent;
  let fixture: ComponentFixture<DiscoverDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
