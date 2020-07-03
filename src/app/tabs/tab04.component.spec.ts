import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab04Component } from './tab04.component';

describe('Tab04Component', () => {
  let component: Tab04Component;
  let fixture: ComponentFixture<Tab04Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab04Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
