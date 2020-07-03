import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab03Component } from './tab03.component';

describe('Tab03Component', () => {
  let component: Tab03Component;
  let fixture: ComponentFixture<Tab03Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tab03Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
