import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDiscoverPageComponent } from './client-discover-page.component';

describe('ClientDiscoverPageComponent', () => {
  let component: ClientDiscoverPageComponent;
  let fixture: ComponentFixture<ClientDiscoverPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDiscoverPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDiscoverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
