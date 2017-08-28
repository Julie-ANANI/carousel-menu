import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ClientDiscoverComponent} from './client-discover.component';

describe('ClientDiscoverComponent', () => {
  let component: ClientDiscoverComponent;
  let fixture: ComponentFixture<ClientDiscoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientDiscoverComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
