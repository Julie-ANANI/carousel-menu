import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDiscoverDescriptionComponent } from './client-discover-description.component';

describe('ClientDiscoverDescriptionComponent', () => {
  let component: ClientDiscoverDescriptionComponent;
  let fixture: ComponentFixture<ClientDiscoverDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDiscoverDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDiscoverDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
